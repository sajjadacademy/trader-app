from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database, models, schemas, auth_utils
from .auth import get_current_admin_user, get_db

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

import random
import string

# ... existing imports ...

@router.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = auth_utils.get_password_hash(user.password)
    
    # Generate 9 digit random number
    account_login = "".join(random.choices(string.digits, k=9))
    
    new_user = models.User(
        username=user.username, 
        hashed_password=hashed_password,
        full_name=user.full_name,
        broker=user.broker,
        account_type=user.account_type,
        account_login=account_login,
        balance=user.balance
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/users", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.balance is not None:
        user.balance = user_update.balance
    if user_update.equity is not None:
        user.equity = user_update.equity
    if user_update.margin is not None:
        user.margin = user_update.margin
    if user_update.account_type is not None:
        user.account_type = user_update.account_type
    
    db.commit()
    db.refresh(user)
    return user

@router.get("/trades", response_model=List[schemas.Trade])
def read_all_trades(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    trades = db.query(models.Trade).order_by(models.Trade.open_time.desc()).offset(skip).limit(limit).all()
    return trades

@router.put("/trades/{trade_id}/outcome")
def force_trade_outcome(trade_id: int, outcome: str, db: Session = Depends(get_db)):
    if outcome not in ["WIN", "LOSS", "NONE"]:
        raise HTTPException(status_code=400, detail="Invalid outcome")
    trade = db.query(models.Trade).filter(models.Trade.id == trade_id).first()
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    
    trade.forced_outcome = outcome
    db.commit()
    trade.forced_outcome = outcome
    db.commit()
    return {"message": f"Trade {trade_id} forced to {outcome}"}

@router.post("/trades/{trade_id}/settle")
def settle_trade(trade_id: int, settlement: schemas.TradeSettle, db: Session = Depends(get_db)):
    # 1. Fetch Trade
    trade = db.query(models.Trade).filter(models.Trade.id == trade_id).first()
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    
    if trade.status == "CLOSED":
         raise HTTPException(status_code=400, detail="Trade already closed")

    # 2. Calculate Profit based on Outcome and Amount
    # If WIN, profit is +amount. If LOSS, profit is -amount.
    final_profit = settlement.amount if settlement.outcome == "WIN" else -settlement.amount
    
    # 3. Update Trade
    trade.profit = final_profit
    trade.status = "CLOSED"
    trade.forced_outcome = settlement.outcome
    trade.close_time = auth_utils.datetime.utcnow()
    # For forced settlement, close_price might not be relevant or can be set to simulated price, 
    # but we just keep it as is or entry_price for simplicity, as profit is forced.
    trade.close_price = trade.entry_price 

    # 4. Update User Balance
    user = db.query(models.User).filter(models.User.id == trade.user_id).first()
    if user:
        user.balance += final_profit
        # Equity typically equals Balance + Floating Profit. Since this trade is closed, 
        # its floating profit is 0 (or realized). 
        # We should strictly recalculate equity based on other open trades, 
        # but a simple approach for now is to just add the profit to equity as well, 
        # assuming equity was tracking balance + open trades.
        user.equity += final_profit
    
    db.commit()
    return {"message": f"Trade {trade_id} settled as {settlement.outcome} with profit {final_profit}", "new_balance": user.balance}

@router.post("/app-settings", response_model=schemas.AppSettings)
def update_settings(settings: schemas.AppSettingsCreate, db: Session = Depends(get_db)):
    db_settings = db.query(models.AppSettings).first()
    if not db_settings:
        db_settings = models.AppSettings(**settings.dict())
        db.add(db_settings)
    else:
        db_settings.app_name = settings.app_name
        db_settings.logo_url = settings.logo_url
        db_settings.theme_primary = settings.theme_primary
        db_settings.theme_secondary = settings.theme_secondary
    
    db.commit()
    db.refresh(db_settings)
    return db_settings
