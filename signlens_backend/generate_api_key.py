from app.api_v1.auth import init_db, generate_api_key

if __name__ == "__main__":
    init_db()
    key = generate_api_key()
    print(f"Generated API Key: {key}")
