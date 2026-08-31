from fastapi import FastAPI
from app.schemas import TripRequest,TripResponse
from app.gemini_client import client
from fastapi.middleware.cors import CORSMiddleware
app=FastAPI()

@app.post("/trip/generate/",response_model=TripResponse)
def generate_trip(trip:TripRequest):
    prompt=f"""You are an AI travel planner.

    Plan a {trip.days}-day trip to {trip.destination}.

    The traveler's budget is ₹{trip.budget}.

    Their interests are: {", ".join(trip.interests)}.

    Organize the itinerary by day, with morning,
    afternoon, and evening activities.

    Keep the itinerary realistic and concise.
"""
    response=client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type":"application/json",
            "response_schema":TripResponse
        }
    )
    trip_response=TripResponse.model_validate_json(response.text)
    return trip_response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)