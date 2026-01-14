from database import SessionLocal, engine
import models
import auth_utils
import random
import string

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

def create_user_sajid():
    db = SessionLocal()
    username = "sajid"
    password = "password123"
    
    # Check if exists again to be safe
    existing_user = db.query(models.User).filter(models.User.username == username).first()
    if existing_user:
        print(f"User '{username}' already exists.")
        db.close()
        return

    hashed_password = auth_utils.get_password_hash(password)
    account_login = "".join(random.choices(string.digits, k=9))
    
    new_user = models.User(
        username=username,
        hashed_password=hashed_password,
        full_name="Sajid User",
        broker="MT5-Real", # Default broker as seen in screenshot
        account_type="Real",
        account_login=account_login,
        balance=10000.0
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    print(f"User '{username}' created successfully with password '{password}'")
    print(f"ID: {new_user.id}, Account Login: {new_user.account_login}")
    db.close()

if __name__ == "__main__":
    create_user_sajid()
