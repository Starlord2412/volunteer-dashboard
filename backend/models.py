from pydantic import BaseModel
from typing import Dict, List, Optional

class Volunteer(BaseModel):
    id: int
    name: str
    skills: str
    location: str
    availability: str
    past_experience: str
    is_assigned: bool = False

class VolunteerAssignmentUpdate(BaseModel):
    is_assigned: bool


class Task(BaseModel):
    id: int
    title: str
    description: str
    required_skills: str
    location: str
    urgency_level: str

class MatchRequest(BaseModel):
    task_id: Optional[int] = None
    task_description: Optional[str] = None
    location: Optional[str]=None
    urgency_level: Optional[str]=None

class MatchResult(BaseModel):
    volunteer_id: int
    volunteer_name: str
    score: float

class MatchExplanationRequest(BaseModel):
    volunteer: Volunteer
    task: Task

class ExtractSkillsRequest(BaseModel):
    description: str






class MatchExplanationResponse(BaseModel):
    explanation: str
    skill_gap_analysis: Dict[str, List[str]]
   