from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import yfinance as yf
import os

from ai_model import predict_next_price, train_or_load_model

app = Flask(__name__, static_folder="dist", static_url_path="")
CORS(app)

# -------------------------------
# API to fetch stock historical data
# -------------------------------
@app.route("/api/stock/<symbol>", methods=["GET"])
def get_stock_data(symbol):
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1mo", interval="1d")

        if hist.empty:
            return jsonify({"error": "No data found"}), 404

        timestamps = [int(ts.timestamp()) for ts in hist.index]
        closes = hist["Close"].tolist()

        data = {
            "chart": {
                "result": [
                    {
                        "timestamp": timestamps,
                        "indicators": {"quote": [{"close": closes}]},
                        "meta": {
                            "symbol": symbol.upper(),
                            "longName": stock.info.get("longName", symbol)
                        }
                    }
                ]
            }
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# API to predict next stock price (AI model)
# -------------------------------
@app.route("/api/predict/<symbol>", methods=["GET"])
def predict_stock(symbol):
    try:
        # Ensure model is trained or loaded
        train_or_load_model(symbol)
        predicted_price = predict_next_price(symbol)
        return jsonify({
            "symbol": symbol.upper(),
            "predicted_price": round(predicted_price, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# API to train or reload AI model for a stock
# -------------------------------
@app.route("/api/train/<symbol>", methods=["POST"])
def train_stock_model(symbol):
    try:
        train_or_load_model(symbol)
        return jsonify({
            "message": f"Model for {symbol.upper()} trained and cached successfully."
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Serve React Frontend
# -------------------------------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


# -------------------------------
# Main
# -------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
