from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import yfinance as yf
import os

app = Flask(__name__, static_folder="dist")
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

        # Prepare data in Yahoo Finance style
        timestamps = [int(ts.timestamp()) for ts in hist.index]
        closes = hist["Close"].tolist()

        data = {
            "chart": {
                "result": [
                    {
                        "timestamp": timestamps,
                        "indicators": {
                            "quote": [{"close": closes}]
                        },
                        "meta": {
                            "symbol": symbol,
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
# API to predict next stock price (basic AI simulation)
# -------------------------------
@app.route("/api/predict/<symbol>", methods=["GET"])
def predict_stock(symbol):
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1mo", interval="1d")

        if hist.empty:
            return jsonify({"error": "No data found"}), 404

        last_price = hist["Close"].iloc[-1]
        # Basic prediction: +2% simulation
        predicted_price = round(last_price * 1.02, 2)

        return jsonify({
            "symbol": symbol,
            "predicted_price": predicted_price
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
