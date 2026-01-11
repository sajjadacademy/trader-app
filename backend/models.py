from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user")  # 'admin' or 'user'
    balance = Column(Float, default=10000.0)
    equity = Column(Float, default=10000.0)
    margin = Column(Float, default=0.0)

    account_type = Column(String, default="demo")  # 'demo' or 'real'
    full_name = Column(String, default="New User")
    account_login = Column(String, unique=True, index=True) # 9 digit random number
    broker = Column(String, default="MetaQuotes-Demo")
    created_at = Column(DateTime, default=datetime.utcnow)

    trades = relationship("Trade", back_populates="user")

class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    symbol = Column(String, index=True)
    type = Column(String)  # 'buy' or 'sell'
    volume = Column(Float)
    entry_price = Column(Float)
    sl = Column(Float, nullable=True)
    tp = Column(Float, nullable=True)
    close_price = Column(Float, nullable=True)
    profit = Column(Float, default=0.0)
    swap = Column(Float, default=0.0)
    commission = Column(Float, default=0.0)
    status = Column(String, default="OPEN")  # 'OPEN', 'CLOSED'
    forced_outcome = Column(String, default="NONE")  # 'NONE', 'WIN', 'LOSS'
    open_time = Column(DateTime, default=datetime.utcnow)
    close_time = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="trades")

class AppSettings(Base):
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True)
    app_name = Column(String, default="Private Trader")
    logo_url = Column(String, nullable=True)
    theme_primary = Column(String, default="#007bff")
    theme_secondary = Column(String, default="#1a1a1a")
