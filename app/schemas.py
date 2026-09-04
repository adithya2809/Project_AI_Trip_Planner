from pydantic import BaseModel,Field

class TripRequest(BaseModel):
    origin:str=Field(min_length=1)
    destination:str=Field(min_length=1)
    days:int=Field(gt=0)
    persons:int=Field(gt=0)
    budget:float=Field(gt=0)
    interests:list[str]

class Activity(BaseModel):
    time:str
    activity:str
    cost:int

class DayPlan(BaseModel):
    day:int
    activities:list[Activity]

class TravelCost(BaseModel):
    mode:str
    description:str
    cost:int
class TripResponse(BaseModel):
    destination:str
    budget:float
    transportation:TravelCost
    itinerary:list[DayPlan]