import pandas as pd
import os
from typing import List, Dict
from database.db import SessionLocal
from sqlalchemy import text

'''DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')

def load_volunteers() -> List[Dict]:
    df = pd.read_csv(os.path.join(DATA_DIR, 'volunteers.csv'))
    return df.to_dict(orient='records')

def load_tasks() -> List[Dict]:
    df = pd.read_csv(os.path.join(DATA_DIR, 'tasks.csv'))
    return df.to_dict(orient='records')'''


def load_volunteers():
   db=SessionLocal()
   try:
       query=text("select * from volunteers")
       result=db.execute(query)
       return [dict(row._mapping) for row in result.fetchall()]
   except Exception as e:
       raise e
   finally:
       db.close()


def load_tasks():
   db=SessionLocal()
   try:
       query=text("select * from tasks")
       result=db.execute(query)
       return [dict(row._mapping) for row in result.fetchall()]
   except Exception as e:
       raise e
   finally:
       db.close()

def get_task_by_id(task_id:int) -> Dict:
    # load tasks in list of dicts
    tasks = load_tasks()
    for task in tasks:
        if task['id'] == task_id:
            return task
    return None

def get_volunteer_by_id(volunteer_id: str) -> Dict:
    volunteers = load_volunteers()
    for vol in volunteers:
        if str(vol['id']) == str(volunteer_id):
            return vol
    return None

