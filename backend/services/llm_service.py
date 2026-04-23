# #from sympy import content
# import os
# import google.genai as genai
# from dotenv import load_dotenv

# load_dotenv()

# # Configure Gemini API
# client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# def get_model():
#     # Use gemini-1.5-flash as the default fast model
#     return "gemini-1.5-flash"
#     '''return client.models.generate_content(
#     model="gemini-1.5-flash",
#     contents="Explain AI model for NGO volunteer matching service"
#     )'''


# def extract_skills_from_description(description: str) -> str:
#     """
#     Use LLM to extract skills from a raw task description.
#     Returns a semicolon-separated list of skills.
#     """
#     model = get_model()
#     prompt = f"""
#     You are an expert at extracting required skills from job or task descriptions.
#     Extract the key skills required for the following NGO task.
#     Return ONLY a semicolon-separated list of skills, with no other text.
#     For example: "Python;Data Analysis;Communication"
    
#     Task Description:
#     {description}
#     """
#     response = client.models.generate_content(model="gemini-1.5-flash",contents=prompt)
#     if response and response.text:
#         return response.text.strip()
#     return ""

# def explain_match(volunteer_info: dict, task_info: dict) -> dict:
#     """
#     Use LLM to explain why a volunteer is a good or bad match for a task.
#     Returns an explanation and an optional skill gap analysis.
#     """
#     model = get_model()
#     prompt = f"""
#     You are an AI assistant helping an NGO match volunteers to tasks.
#     Analyze the fit between the following Volunteer and the NGO Task.
    
#     Volunteer:
#     Name: {volunteer_info.get('name')}
#     Skills: {volunteer_info.get('skills')}
#     Location: {volunteer_info.get('location')}
#     Experience: {volunteer_info.get('past_experience')}
    
#     Task:
#     Title: {task_info.get('title')}
#     Required Skills: {task_info.get('required_skills')}
#     Location: {task_info.get('location')}
#     Description: {task_info.get('description')}
    
#     Please provide:
#     1. An explanation of why this volunteer is or isn't a good fit.
#     2. A skill gap analysis (what skills they are missing).
    
#     Format the output exactly like this:
#     Explanation: <your explanation>
#     Skill Gap Analysis: <your skill gap analysis>
#     """
#     response = client.models.generate_content(model="gemini-1.5-flash",contents=prompt)
    
#     explanation = "Could not generate explanation."
#     skill_gap = "Could not generate skill gap analysis."
    
#     if response and response.text:
#         lines = response.text.split('\n')
#         exp_lines = []
#         gap_lines = []
#         parsing_gap = False
#         for line in lines:
#             if line.startswith("Skill Gap Analysis:"):
#                 parsing_gap = True
#                 gap_lines.append(line.replace("Skill Gap Analysis:", "").strip())
#             elif line.startswith("Explanation:"):
#                 exp_lines.append(line.replace("Explanation:", "").strip())
#             elif parsing_gap:
#                 gap_lines.append(line.strip())
#             else:
#                 exp_lines.append(line.strip())
                
#         explanation = " ".join(exp_lines).strip()
#         skill_gap = " ".join(gap_lines).strip()
        
#     return {
#         "explanation": explanation,
#         "skill_gap_analysis": skill_gap
#     }







import os
import time
from dotenv import load_dotenv
import google.genai as genai

# ===============================
# Load Environment Variables
# ===============================
load_dotenv()

# ===============================
# Configure Gemini Client
# ===============================
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# ===============================
# Select Working Model
# ===============================
def get_model():
    return "gemini-2.0-flash"


# ===============================
# Safe Gemini Call with Retry
# ===============================
def generate_with_retry(prompt, retries=3, delay=2):
    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model=get_model(),
                contents=prompt
            )
            return response

        except Exception as e:
            print(f"Gemini attempt {attempt+1} failed: {e}")
            time.sleep(delay)

    return None


# ===============================
# Extract Skills from Description
# ===============================
def extract_skills_from_description(description: str) -> str:
    """
    Extract required skills from NGO task description.
    Returns semicolon-separated string.
    """

    prompt = f"""
    You are an expert at extracting important skills.

    Extract only the required skills from the NGO task below.

    Return ONLY semicolon-separated skills.

    Example:
    Driving;First Aid;Leadership

    Task:
    {description}
    """

    response = generate_with_retry(prompt)

    if response and response.text:
        return response.text.strip()

    # fallback
    return "Communication;Teamwork;Leadership"


# ===============================
# Explain Volunteer Match
# ===============================
def explain_match(volunteer_info: dict, task_info: dict) -> dict:
    """
    Explain why volunteer matches task.
    """

    prompt = f"""
    You are an NGO volunteer matching AI.

    Compare the volunteer and task.

    Volunteer:
    Name: {volunteer_info.get("name")}
    Skills: {volunteer_info.get("skills")}
    Location: {volunteer_info.get("location")}
    Experience: {volunteer_info.get("past_experience")}

    Task:
    Title: {task_info.get("title")}
    Required Skills: {task_info.get("required_skills")}
    Location: {task_info.get("location")}
    Description: {task_info.get("description")}

    Return exactly:

    Explanation: <why match good or bad>
    Skill Gap Analysis: <missing skills>
    """

    response = generate_with_retry(prompt)

    explanation = "Could not generate explanation."
    skill_gap = "Could not generate skill gap analysis."

    if response and response.text:
        lines = response.text.split("\n")

        exp_lines = []
        gap_lines = []
        parsing_gap = False

        for line in lines:
            line = line.strip()

            if line.startswith("Explanation:"):
                exp_lines.append(
                    line.replace("Explanation:", "").strip()
                )

            elif line.startswith("Skill Gap Analysis:"):
                parsing_gap = True
                gap_lines.append(
                    line.replace(
                        "Skill Gap Analysis:", ""
                    ).strip()
                )

            elif parsing_gap:
                gap_lines.append(line)

            else:
                exp_lines.append(line)

        explanation = " ".join(exp_lines).strip()
        skill_gap = " ".join(gap_lines).strip()

    else:
        explanation = (
            "Volunteer appears suitable based on available skills."
        )
        skill_gap = "No detailed analysis available."

    return {
        "explanation": explanation,
        "skill_gap_analysis": skill_gap

        
    }
    