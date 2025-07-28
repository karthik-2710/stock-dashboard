import os
import yfinance as yf
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense, LSTM
from tensorflow.keras.optimizers import Adam
import joblib

# Cache to avoid reloading/training repeatedly
MODEL_CACHE = {}
MODEL_DIR = "models"

# Ensure the models directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

def train_or_load_model(symbol):
    """
    Train a new LSTM model or load an existing one for the given stock symbol.
    """
    symbol = symbol.upper()
    model_path = os.path.join(MODEL_DIR, f"{symbol}_model.h5")
    scaler_path = os.path.join(MODEL_DIR, f"{symbol}_scaler.gz")

    # 1. Use cache if already loaded
    if symbol in MODEL_CACHE:
        return MODEL_CACHE[symbol]

    # 2. Load pre-trained model and scaler if available
    if os.path.exists(model_path) and os.path.exists(scaler_path):
        print(f"Loading pre-trained model for {symbol}...")
        model = load_model(model_path)
        scaler = joblib.load(scaler_path)
        data = yf.download(symbol, period="2y")
        if data.empty:
            raise ValueError(f"No data found for {symbol}")
        scaled_data = scaler.transform(data['Close'].values.reshape(-1, 1))
        MODEL_CACHE[symbol] = (model, scaler, scaled_data)
        return model, scaler, scaled_data

    # 3. Train new model if no pre-trained version exists
    print(f"Training LSTM model for {symbol}...")
    data = yf.download(symbol, period="2y")
    if data.empty:
        raise ValueError(f"No data found for {symbol}")

    close_prices = data['Close'].values.reshape(-1, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(close_prices)

    # Prepare training data
    X_train, y_train = [], []
    for i in range(60, len(scaled_data)):
        X_train.append(scaled_data[i - 60:i, 0])
        y_train.append(scaled_data[i, 0])

    X_train, y_train = np.array(X_train), np.array(y_train)
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))

    # Build LSTM model
    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
    model.add(LSTM(50))
    model.add(Dense(1))
    model.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error')
    model.fit(X_train, y_train, epochs=5, batch_size=32, verbose=1)

    # Save model and scaler
    model.save(model_path)
    joblib.dump(scaler, scaler_path)

    MODEL_CACHE[symbol] = (model, scaler, scaled_data)
    return model, scaler, scaled_data


def predict_next_price(symbol):
    """
    Predict the next stock price using the trained LSTM model.
    """
    model, scaler, scaled_data = train_or_load_model(symbol)
    last_60 = scaled_data[-60:]
    X_test = np.reshape(last_60, (1, last_60.shape[0], 1))
    pred_price = model.predict(X_test)
    return float(scaler.inverse_transform(pred_price)[0][0])
