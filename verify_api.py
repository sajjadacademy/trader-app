import requests
import json
import random
import string

BASE_URL = "http://localhost:8000"

def test_admin_flow():
    print("--- Testing Admin Flow ---")
    
    # 1. Fetch Users (Expect empty or list)
    try:
        print("1. Fetching users...")
        res = requests.get(f"{BASE_URL}/admin/users")
        print(f"Status Code: {res.status_code}")
        print(f"Response: {res.text}")
        users = res.json()
        print(f"Current User Count: {len(users)}")
    except Exception as e:
        print(f"Failed to fetch users: {e}")
        return

    # 2. Create User
    username = "testuser_" + "".join(random.choices(string.ascii_lowercase, k=5))
    payload = {
        "full_name": "Test User",
        "username": username,
        "password": "password123",
        "broker": "MetaQuotes-Demo",
        "account_type": "demo",
        "balance": 10000.0
    }
    
    try:
        print(f"\n2. Creating user {username}...")
        res = requests.post(f"{BASE_URL}/admin/users", json=payload)
        print(f"Status Code: {res.status_code}")
        print(f"Response: {res.text}")
        
        if res.status_code == 200:
            print("User created successfully.")
        else:
            print("User creation failed.")
    except Exception as e:
        print(f"Failed to create user: {e}")
        return

    # 3. Fetch Users Again
    try:
        print("\n3. Fetching users again...")
        res = requests.get(f"{BASE_URL}/admin/users")
        print(f"Status Code: {res.status_code}")
        users = res.json()
        print(f"Response: {users}")
        print(f"New User Count: {len(users)}")
    except Exception as e:
        print(f"Failed to fetch users: {e}")

if __name__ == "__main__":
    test_admin_flow()
