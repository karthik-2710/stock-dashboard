from ai_model import train_or_load_model

# List of stock symbols to train models for
STOCKS = ["AAPL", "MSFT", "TSLA", "BMW.DE", "NSU.DE", "GOOG"]  
# Note: AUDI doesn't have a direct ticker; "NSU.DE" is Audi's stock on the German exchange.

if __name__ == "__main__":
    print("=== Starting training for all selected stocks ===")
    for stock in STOCKS:
        try:
            print(f"\n--- Training model for {stock} ---")
            train_or_load_model(stock)
        except Exception as e:
            print(f"❌ Failed to train {stock}: {e}")
    print("\n✅ All models have been trained and saved in the 'models/' directory.")
