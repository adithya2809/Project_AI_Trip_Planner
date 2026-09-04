from pydantic import BaseModel,Field

class TripRequest(BaseModel):
    destination:str=Field(min_length=1)
    days:int=Field(gt=0)
    budget:float=Field(gt=0)
    interests:list[str]

class Activity(BaseModel):
    time:str
    activity:str
    cost:int

class DayPlan(BaseModel):
    day:int
    activities:list[Activity]

class TripResponse(BaseModel):
    destination:str
    budget:float
    itinerary:list[DayPlan]