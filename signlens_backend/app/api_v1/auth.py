
import mysql.connector
import secrets
from fastapi import HTTPException, status, Depends, Header
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

MYSQL_CONFIG = {
    'host': os.getenv('MYSQL_HOST'),
    'user': os.getenv('MYSQL_USER'),
    'password': os.getenv('MYSQL_PASSWORD'),
    'database': os.getenv('MYSQL_DATABASE'),
    'port': os.getenv('MYSQL_PORT'),
}

def get_conn():
    return mysql.connector.connect(**MYSQL_CONFIG)

def init_db():
    conn = get_conn()
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS api_keys (
            id INT AUTO_INCREMENT PRIMARY KEY,
            `key` VARCHAR(128) UNIQUE NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def generate_api_key():
    key = secrets.token_hex(32)
    conn = get_conn()
    c = conn.cursor()
    c.execute("INSERT INTO api_keys (`key`) VALUES (%s)", (key,))
    conn.commit()
    conn.close()
    return key

def verify_api_key(x_api_key: str = Header(...)):
    conn = get_conn()
    c = conn.cursor()
    c.execute("SELECT 1 FROM api_keys WHERE `key`=%s", (x_api_key,))
    result = c.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API Key")
    return x_api_key
