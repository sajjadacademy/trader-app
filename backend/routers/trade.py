from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import database, models, schemas
from .auth import get_current_user, get_db

router = APIRouter(
    prefix="/trades",
    tags=["trades"]
)

@router.post("/", response_model=schemas.Trade)
def place_trade(trade: schemas.TradeCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Basic check for margin/balance can be added here
    new_trade = models.Trade(
        user_id=current_user.id,
        symbol=trade.symbol,
        type=trade.type,
        volume=trade.volume,
        entry_price=trade.entry_price,
        sl=trade.sl,
        tp=trade.tp,
        status="OPEN"
    )
    db.add(new_trade)
    db.commit()
    db.refresh(new_trade)
    return new_trade

@router.get("/", response_model=List[schemas.Trade])
def get_my_trades(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Trade).filter(models.Trade.user_id == current_user.id).order_by(models.Trade.open_time.desc()).all()

@router.put("/{trade_id}/close", response_model=schemas.Trade)
def close_trade(trade_id: int, close_price: float, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    trade = db.query(models.Trade).filter(models.Trade.id == trade_id, models.Trade.user_id == current_user.id).first()
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    
    if trade.status == "CLOSED":
        raise HTTPException(status_code=400, detail="Trade already closed")

    # Calculate P/L
    multiplier = 1 if trade.type == 'buy' else -1
    raw_profit = (close_price - trade.entry_price) * trade.volume * multiplier * 100000 # Standard Lot (100k units)
    
    # Apply forced outcome if any
    if trade.forced_outcome == "WIN":
        raw_profit = abs(raw_profit) if raw_profit != 0 else 100
    elif trade.forced_outcome == "LOSS":
        raw_profit = -abs(raw_profit) if raw_profit != 0 else -100

    trade.close_price = close_price
    trade.profit = raw_profit
    trade.status = "CLOSED"
    trade.close_time = datetime.utcnow()
    
    # Update user balance
    current_user.balance += raw_profit
    current_user.equity += raw_profit # Simplify for now
    
    db.commit()
    db.refresh(trade)
    return trade
