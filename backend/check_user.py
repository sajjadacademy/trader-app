from database import SessionLocal
from models import User

def check_user(username):
    db = SessionLocal()
    user = db.query(User).filter(User.username == username).first()
    db.close()
    if user:
        print(f"User '{username}' FOUND. ID: {user.id}")
        return True
    else:
        print(f"User '{username}' NOT FOUND.")
        return False

if __name__ == "__main__":
    check_user("sajid")
