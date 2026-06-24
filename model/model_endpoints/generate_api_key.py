from app.api_v1.auth import init_db, generate_api_key, get_existing_api_key

if __name__ == "__main__":
    init_db()
    
    existing_key = get_existing_api_key()
    if existing_key:
        print(f"Existing API Key found: {existing_key}")
    else:
        key = generate_api_key()
        print(f"Generated new API Key: {key}")


