import { useState } from 'react'
import './App.css'
function App(){
  const [trip,setTrip]=useState({
    origin:"",
    destination:"",
    days: "",
    persons:"",
    budget: "",
    interests:[]

  });
  const [tripResult,setTripResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [errors,setErrors]=useState({
    origin:"",
    destination:"",
    days:"",
    persons:"",
    budget:"",
    transportation:"",
    interests:""
  });
  const validateForm=()=>{
    const newErrors={
      origin:"",
      destination:"",
      days:"",
      persons:"",
      budget:"",
      interests:""
    };
    if(trip.origin.trim()===""){
      newErrors.origin="Please enter your Starting Location"
    }
    if (trip.destination.trim()===""){
      newErrors.destination="Please enter a destination";
    }
    if (trip.days <= 0) {
    newErrors.days="Days must be greater than 0";
  }
    if (trip.persons <= 0){
      newErrors.persons="Members must be greater than 0";
    }
    if (trip.budget <= 0) {
    newErrors.budget="Budget must be greater than 0";
  }

    if (trip.interests.length === 0) {
    newErrors.interests="Please enter at least one interest";
  }
    setErrors(newErrors);
    return Object.values(newErrors).every((error)=>error==="")
  }
  const generateTrip=async ()=>{
    setError("");
    if (!validateForm()) return;
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
      if(!response.ok){
        throw new Error(data.detail||"failed to generate trip")
      }
      setTripResult(data);
    }
    catch(error){
      console.error("Error generating trip:", error)
      setError(error.message);
      setTripResult(null);
    }
    finally{
      setLoading(false)
    } 
  }

const totalCost=tripResult?.itinerary?.reduce((tripTotal,day)=>{
  const dayTotal=day.activities.reduce((total,activity)=>{
    return total+activity.cost;
  },0);
  return tripTotal+dayTotal;
},0) ?? 0;


return(
  <>
  <header>
    <h1>Itinera<span>AI</span></h1>
  </header>
  <div className="inputs">
  <div className="floating-field">
  <input id="origin" type="text" placeholder=" " value={trip.origin} 
  className={errors.origin?"input_error":""}
  onChange={(e)=>{
    setTrip({
      ...trip,
      origin:e.target.value
    });
     if (errors.origin){
      setErrors({...errors,origin:""});
    }
  }}/>
  <label htmlFor="origin">Origin (from)</label>
  </div>
  {errors.origin&&(
    <p>{errors.origin}</p>  
    )}
  
  <div className="floating-field">
  <input id="destination" type="text" placeholder=" " value={trip.destination} 
  className={errors.destination?"input_error":""} 
  onChange={(e)=>{
    setTrip({
      ...trip,
      destination: e.target.value
    });
    if (errors.destination){
      setErrors({...errors,destination:""});
    }
  }}/>
  <label htmlFor="destination">Destination</label>
  </div>
  {errors.destination&&(
    <p>{errors.destination}</p>  
    )}
   
  <div className="floating-field">
  <input
  id="days"
  type="number"
  placeholder=" "
  value={trip.days}
  className={errors.days?"input_error":""}
  onChange={(e) =>{
    setTrip({
      ...trip,
      days: Number(e.target.value)
    });
  if (errors.days){
    setErrors({...errors,days:""});
  }}
  }
/>
  <label htmlFor="days">Days</label>
  </div>
{errors.days &&
<p>{errors.days}</p>
}

<div className="floating-field">
<input
  id="members"
  type="number"
  placeholder=" "
  value={trip.persons}
  className={errors.persons?"input_error":""}
  onChange={(e) =>{
    setTrip({
      ...trip,
      persons: Number(e.target.value)
    });
  if (errors.persons){
    setErrors({...errors,persons:""});
  }}
  }
/>
  <label htmlFor="members">Members</label>
  </div>
{errors.persons &&
<p>{errors.persons}</p>
}

<div className="floating-field">
<input
  id="budget"
  type="number"
  placeholder=" "
  value={trip.budget}
  className={errors.budget?"input_error":""}
  onChange={(e) =>{
    setTrip({
      ...trip,
      budget: Number(e.target.value)
    });
    if (errors.budget){
      setErrors({...errors,budget:""});
    }
  }}
/>
<label htmlFor="budget">Budget per person (in ₹)</label>
</div>
{errors.budget &&
<p>{errors.budget}</p>
}
<div className="floating-field">
<input
  id="interests"
  type="text"
  placeholder=" "
  className={errors.interests?"input_error":""}
  onChange={(e) =>{
    setTrip({
      ...trip,
      interests: e.target.value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "")
    });
    if (errors.interests){
      setErrors({...errors,interests:""})
    }
  }}
/>
<label htmlFor="interests">Interests (e.g. food, temples, shopping)</label>
</div>
</div>
{errors.interests &&
<p>{errors.interests}</p>
}
  <button onClick={generateTrip} disabled={loading}>{loading?"generating...":"Generate"}</button>
  {loading &&(
  <div className="loading">
  <span></span>
  <span></span>
  <span></span>
  </div>
 ) }
  {error &&
  <p>❌{error}</p>}
  {tripResult && (
  <div>
    <h1>{tripResult.destination}</h1>

    <p>Budget: ₹{tripResult.budget} per Person</p>
        <p>Total Estimated Cost:₹{totalCost}</p>
<div className="transportation">
  <h2>Transportation</h2>
  <p><strong>{tripResult.transportation.mode}</strong></p>
  <p>{tripResult.transportation.description}</p>
  <p>Estimated cost: ₹{tripResult.transportation.cost}</p>
</div>    
{tripResult.itinerary.map((day) => (
      <div key={day.day} className="day-card">
        <h2>Day {day.day}</h2>
      
        {day.activities.map((activity, index) => (
  <div key={index} className="activity">
    <strong>{activity.time}</strong>
    <p>{activity.activity}</p>
    <p>Estimated Cost:{activity.cost}</p>
  </div>
))}
      </div>
    ))}
  </div>
)}

  </>
);
}
export default App;
