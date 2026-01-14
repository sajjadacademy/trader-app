import requests

BASE_URL = "http://localhost:8000"

def test_login(username, password):
    print(f"Attempting login for {username}...")
    url = f"{BASE_URL}/auth/token"
    # OAuth2PasswordRequestForm expects form data, not JSON
    data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(url, data=data) 
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("Login SUCCESS!")
            print("Response:", response.json())
        else:
            print("Login FAILED!")
            print("Response:", response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login("sajid", "password123")
