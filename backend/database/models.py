from backend.database.db import Base
from sqlalchemy import Column, Integer, Text,VARCHAR 

class tasks(Base):
    __tablename__="tasks"
    id=Column(Integer,primary_key=True,index=True)
    title=Column(VARCHAR(255),nullable=False)
    description=Column(Text,nullable=False)
    required_skills=Column(VARCHAR(255),nullable=False)
    location=Column(VARCHAR(255),nullable=False)
    urgency_level=Column(VARCHAR(50),nullable=False)


class volunteers(Base):
    __tablename__="volunteers"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(VARCHAR(255),nullable=False)
    skills=Column(VARCHAR(255),nullable=False)
    location=Column(VARCHAR(255),nullable=False)
    availability=Column(VARCHAR(255),nullable=False)
    past_experience=Column(Text,nullable=False)