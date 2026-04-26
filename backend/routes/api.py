from fastapi import APIRouter, HTTPException
from typing import List, Dict
from models import (
    MatchRequest,
    MatchResult,
    MatchExplanationRequest,
    MatchExplanationResponse,
    ExtractSkillsRequest,
    Task,
    Volunteer
)
from services.data_service import get_volunteer_by_id, load_tasks, load_volunteers, get_task_by_id
from services.ml_service import match_volunteers_to_task
from services.llm_service import extract_skills_from_description, explain_match

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.get("/tasks",response_model=list[Task])
def get_tasks():
  tasks=load_tasks()
  return tasks

@router.get("/volunteers",response_model=List[Volunteer])
def get_volunteers():
    volunteers=load_volunteers() 
    return volunteers

@router.post("/extract-skills")
def extract_skills(request: ExtractSkillsRequest):
    skills = extract_skills_from_description(request.description)
    return {"skills": skills}

@router.post("/match-volunteers", response_model=List[MatchResult])
def match_volunteers(request: MatchRequest):
    volunteers = load_volunteers()
    
    if request.task_id:
        task = get_task_by_id(request.task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        else:
            volunteer=[]
            for vol in volunteers:
             if request.location==vol['location']:
                if request.urgency_level=='High' and vol['availability']=='Full-time':
                    volunteer.append(vol)

                elif request.urgency_level=='Medium' and vol['availability'] in ['Full-time', 'Weekends']:
                    volunteer.append(vol)
                else:
                    volunteer.append(vol)
             else:  volunteer.append(vol)              
    elif request.task_description:
        # Create a temporary task object if only description is provided
        task = {
            "id":00,
            "title": "Custom Task",
            "description": request.task_description,
            "required_skills": "", # We might want to use the LLM to extract this first if it's missing, but let's keep it simple or assume it's extracted
            "location": ""
        }
        # Let's extract skills using LLM to make the match better
        extracted_skills = extract_skills_from_description(request.task_description)
        task["required_skills"] = extracted_skills
    else:
        raise HTTPException(status_code=400, detail="Must provide task_id or task_description")

    matches = match_volunteers_to_task(task, volunteer, top_n=5)
    return matches

@router.post("/explain-match", response_model=MatchExplanationResponse)
def explain_match_route(request: MatchExplanationRequest):
    volunteer_info = request.volunteer.model_dump()
    task_info = request.task.model_dump()
    
    explanation_data = explain_match(volunteer_info, task_info)
    return MatchExplanationResponse(
        explanation=explanation_data.get("explanation", ""),
        skill_gap_analysis=skill_data
    )
     





     ######################################
@router.put("/volunteers/{volunteer_id}/assignment")
def update_assignment(volunteer_id: int, update_data: VolunteerAssignmentUpdate):
    success = update_volunteer_assignment(volunteer_id, update_data.is_assigned)
    if not success:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    return {"status": "success", "is_assigned": update_data.is_assigned}

@router.get("/dashboard/urgent-matches")
def get_urgent_matches():
    tasks = load_tasks()
    volunteers = load_volunteers()
    urgent_tasks = [t for t in tasks if t.get('urgency_level') == 'High']
    
    results = []
    for task in urgent_tasks:
        # Match using available volunteers
        matches = match_volunteers_to_task(task, volunteers, top_n=5)
        results.append({
            "task": task,
            "matches": matches
        })
    return results
