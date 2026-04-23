from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict

def create_tag(item: Dict, is_volunteer: bool = True) -> str:
    """
    Combine skills and location into a single string for vectorization.
    """
    skills = str(item.get('skills', '') if is_volunteer else item.get('required_skills', ''))
    skills_cleaned = " ".join(skills.replace(';', ' ').split())
    location = str(item.get('location', ''))
    return f"{skills_cleaned} {location}".strip().lower()

def match_volunteers_to_task(task: Dict, volunteers: List[Dict], top_n: int = 5) -> List[Dict]:
    """
    Match volunteers to a task using TfidfVectorizer and cosine similarity.
    """
    if not volunteers:
        return []

    # Prepare documents
    task_tag = create_tag(task, is_volunteer=False)
    volunteer_tags = [create_tag(vol, is_volunteer=True) for vol in volunteers]
    
    documents = [task_tag] + volunteer_tags
    
    # Vectorize
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(documents)
    
    # Calculate cosine similarity between the task (index 0) and all volunteers (index 1 to N)
    task_vector = tfidf_matrix[0:1]
    volunteer_vectors = tfidf_matrix[1:]
    
    similarities = cosine_similarity(task_vector, volunteer_vectors).flatten()
    
    # Rank volunteers
    ranked_indices = similarities.argsort()[::-1]
    
    results = []
    for i in ranked_indices[:top_n]:
        vol = volunteers[i]
        score = float(similarities[i])
        results.append({
            "volunteer_id": str(vol['id']),
            "volunteer_name": vol['name'],
            "score": score
        })
        
    return results
