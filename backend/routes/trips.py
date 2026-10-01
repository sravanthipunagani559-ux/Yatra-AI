from fastapi import APIRouter, HTTPException, Path
from models import TripRequest, TripResponse, ReplanRequest, ReplanResponse, AcceptReplanRequest
from ai_service import generate_itinerary, replan_itinerary
import database

router = APIRouter(prefix="/trips", tags=["Trips"])


@router.post("/generate", response_model=TripResponse)
async def create_trip(req: TripRequest):
    try:
        trip = await generate_itinerary(req)
        await database.save_trip(trip.model_dump())
        return trip
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate trip: {str(e)}")


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip_by_id(trip_id: str = Path(...)):
    trip_data = await database.get_trip(trip_id)
    if not trip_data:
        raise HTTPException(status_code=404, detail="Trip not found")
    return TripResponse(**trip_data)


@router.post("/replan", response_model=ReplanResponse)
async def replan_trip(req: ReplanRequest):
    try:
        return await replan_itinerary(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to replan: {str(e)}")


@router.put("/{trip_id}/accept-replan", response_model=TripResponse)
async def accept_replan(trip_id: str, req: AcceptReplanRequest):
    trip_data = await database.get_trip(trip_id)
    if not trip_data:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    days_plan = trip_data.get("days_plan", [])
    if 0 <= req.day_index < len(days_plan):
        activities = days_plan[req.day_index].get("activities", [])
        if 0 <= req.activity_index < len(activities):
            activities[req.activity_index] = req.new_activity.model_dump()
            days_plan[req.day_index]["activities"] = activities
            trip_data["days_plan"] = days_plan
            await database.update_trip(trip_id, trip_data)
            return TripResponse(**trip_data)
            
    raise HTTPException(status_code=400, detail="Invalid day or activity index")
