from  sqlalchemy import engine
import os
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

load_dotenv()
database_url=os.getenv("database_url")
engine=engine.create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db=SessionLocal()
    try: 
        yield db
    finally:
        db.close()