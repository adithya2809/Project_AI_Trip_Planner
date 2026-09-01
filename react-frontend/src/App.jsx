import { useState } from 'react'

function App(){
  const [trip,setTrip]=useState({
    destination:"",
    days: 1,
    budget: 0,
    interests:[]

  });
  const [tripResult,setTripResult]=useState(null);
  const [loading,setLoading]=useState(false);

  const generateTrip=async ()=>{
    setLoading(true);

    try{
      const response=await fetch("http://127.0.0.1:8000/trip/generate",{
        method:"POST",
        headers:{
          "content-type":"application/json"
        },
        body:JSON.stringify(trip)
      }
        
      );
      const data=await response.json();
      console.log("API response:", data);
      setTripResult(data);

    }
    catch(error){
      console.error("error generating trip: ",error);
    }
    finally{
      setLoading(false)
    } 
  }


return(
  <>
  <input type="text" placeholder='destination' value={trip.destination} onChange={(e)=>
    setTrip({
      ...trip,
      destination: e.target.value
    })
  }/>
  <input
  type="number"
  placeholder="Days"
  value={trip.days}
  onChange={(e) =>
    setTrip({
      ...trip,
      days: Number(e.target.value)
    })
  }
/>

<input
  type="number"
  placeholder="Budget"
  value={trip.budget}
  onChange={(e) =>
    setTrip({
      ...trip,
      budget: Number(e.target.value)
    })
  }
/>
<input
  type="text"
  placeholder="Interests (e.g. food, temples, shopping)"
  onChange={(e) =>
    setTrip({
      ...trip,
      interests: e.target.value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "")
    })
  }
/>
  <button onClick={generateTrip}>{loading?"generating...":"Generate"}</button>
  {tripResult && (
  <div>
    <h1>{tripResult.destination}</h1>

    <p>Budget: ₹{tripResult.budget}</p>

    {tripResult.itinerary.map((day) => (
      <div key={day.day}>
        <h2>Day {day.day}</h2>

        {day.activities?.map((activity, index) => (
          <p key={index}>
            <strong>{activity.time}:</strong>{" "}
            {activity.activity}
          </p>
        ))}
      </div>
    ))}
  </div>
)}
  </>
);
}
export default App;
