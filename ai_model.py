import yfinance as yf
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM
from tensorflow.keras.optimizers import Adam

MODEL_CACHE = {}

def train_or_load_model(symbol):
    symbol = symbol.upper()
    if symbol in MODEL_CACHE:
        return MODEL_CACHE[symbol]
    
    print(f"Training LSTM model for {symbol}...")
    data = yf.download(symbol, period="2y")
    if data.empty:
        raise ValueError(f"No data found for {symbol}")
    
    close_prices = data['Close'].values.reshape(-1, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(close_prices)
    
    X_train, y_train = [], []
    for i in range(60, len(scaled_data)):
        X_train.append(scaled_data[i-60:i, 0])
        y_train.append(scaled_data[i, 0])
    
    X_train, y_train = np.array(X_train), np.array(y_train)
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))
    
    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
    model.add(LSTM(50))
    model.add(Dense(1))
    model.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error')
    model.fit(X_train, y_train, epochs=3, batch_size=32, verbose=1)
    
    MODEL_CACHE[symbol] = (model, scaler, scaled_data)
    return model, scaler, scaled_data

def predict_next_price(symbol):
    model, scaler, scaled_data = train_or_load_model(symbol)
    last_60 = scaled_data[-60:]
    X_test = np.reshape(last_60, (1, last_60.shape[0], 1))
    pred_price = model.predict(X_test)
    return float(scaler.inverse_transform(pred_price)[0][0])
