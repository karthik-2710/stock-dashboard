from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import yfinance as yf
import os
from ai_model import predict_next_price  # <-- Real AI prediction here

app = Flask(__name__, static_folder="dist", static_url_path="")
CORS(app)

# -------------------------------
# API: Stock Historical Data
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
# API: AI Stock Price Prediction
# -------------------------------
@app.route("/api/predict/<symbol>", methods=["GET"])
def predict_stock(symbol):
    try:
        predicted_price = predict_next_price(symbol)
        return jsonify({
            "symbol": symbol.upper(),
            "predicted_price": round(predicted_price, 2)
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
