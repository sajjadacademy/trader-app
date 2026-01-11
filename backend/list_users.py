from database import SessionLocal
import models

def list_users():
    db = SessionLocal()
    try:
        users = db.query(models.User).all()
        for user in users:
            print(f"ID: {user.id}, Username: {user.username}, Role: {user.role}, Hash: {user.hashed_password[:10]}...")
    finally:
        db.close()

if __name__ == "__main__":
    list_users()
