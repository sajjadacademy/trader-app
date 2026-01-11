from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    full_name: str
    broker: str
    account_type: str = "demo"
    balance: float = 10000.0

class UserUpdate(BaseModel):
    balance: Optional[float] = None
    equity: Optional[float] = None
    margin: Optional[float] = None
    account_type: Optional[str] = None
    full_name: Optional[str] = None
    broker: Optional[str] = None

class User(UserBase):
    id: int
    role: str
    balance: float
    equity: float
    margin: float
    account_type: str
    full_name: str
    account_login: str
    broker: str
    created_at: datetime

    class Config:
        from_attributes = True

# Trade Schemas
class TradeBase(BaseModel):
    symbol: str
    type: str
    volume: float
    entry_price: float
    sl: Optional[float] = None
    tp: Optional[float] = None

class TradeCreate(TradeBase):
    pass

class Trade(TradeBase):
    id: int
    user_id: int
    profit: float
    swap: float = 0.0
    commission: float = 0.0
    status: str
    forced_outcome: str
    open_time: datetime
    close_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class TradeSettle(BaseModel):
    outcome: str # "WIN" or "LOSS"
    amount: float

# App Settings Schemas
class AppSettingsBase(BaseModel):
    app_name: str
    logo_url: Optional[str] = None
    theme_primary: str
    theme_secondary: str

class AppSettingsCreate(AppSettingsBase):
    pass

class AppSettings(AppSettingsBase):
    id: int

    class Config:
        from_attributes = True
