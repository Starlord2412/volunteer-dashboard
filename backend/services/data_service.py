import pandas as pd
import os
from typing import List, Dict

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')

def load_volunteers() -> List[Dict]:
    df = pd.read_csv(os.path.join(DATA_DIR, 'volunteers.csv'))
    return df.to_dict(orient='records')

def load_tasks() -> List[Dict]:
    df = pd.read_csv(os.path.join(DATA_DIR, 'tasks.csv'))
    return df.to_dict(orient='records')

def get_task_by_id(task_id:int) -> Dict:
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

def update_volunteer_assignment(volunteer_id: int, is_assigned: bool) -> bool:
    file_path = os.path.join(DATA_DIR, 'volunteers.csv')
    df = pd.read_csv(file_path)
    if volunteer_id in df['id'].values:
        df.loc[df['id'] == volunteer_id, 'is_assigned'] = is_assigned
        df.to_csv(file_path, index=False)
        return True
    return False

