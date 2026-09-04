import { useState } from 'react'
import './App.css'
function App(){
  const [trip,setTrip]=useState({
    origin:"",
    destination:"",
    days: "",
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
    budget:"",
    interests:""
  });
  const validateForm=()=>{
    const newErrors={
      origin:"",
      destination:"",
      days:"",
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
  <input type="text" placeholder='origin(from)' value={trip.origin} 
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
  {errors.origin&&(
    <p>{errors.origin}</p>  
    )}
  
  <input type="text" placeholder='destination' value={trip.destination} 
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
  {errors.destination&&(
    <p>{errors.destination}</p>  
    )}
   
  <input
  type="number"
  placeholder='Days'
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
{errors.days &&
<p>{errors.days}</p>
}

<input
  type="number"
  placeholder='Budget'
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
{errors.budget &&
<p>{errors.budget}</p>
}
<input
  type="text"
  placeholder="Interests (e.g. food, temples, shopping)"
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

    <p>Budget: ₹{tripResult.budget}</p>
        <p>Total Estimated Cost:₹{totalCost}</p>

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
