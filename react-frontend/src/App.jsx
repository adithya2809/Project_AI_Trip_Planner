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
  <button onClick={generateTrip}>{loading?"generating...":"Generate"}</button>
  </>
)
}
export default App;
