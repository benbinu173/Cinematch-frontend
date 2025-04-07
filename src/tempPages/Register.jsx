import React, { useState } from 'react';
import registerimg from "../assets/Animation - 1742100674978.gif";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { registerAPI } from '../Services/allApi';
import './Register.css';

function Register() {


  const navigate = useNavigate()
  const [userDetails , setUserDetails] = useState({
    username : "",
    email : "",
    password :""
  })
  console.log(userDetails);

  const handleRegister = async ()=>
  {
    const {username , email ,password} = userDetails

    if(!username || !email || !password)
    {
      toast.info(`Please fill the form completely`)
    }
    else
    {

      const result = await registerAPI(userDetails)
      console.log(result);

      if(result.status >=200 && result.status<300)

        {

          toast.info(`registeration successfull`)
          setUserDetails(
            {
              username: "",
              email:"",
              password:""
            }
          )    
          navigate('/login')

        }
        else if(result.status >=400 && result.status<500)
        {
          toast.info(result.response?.data || `something went wrong `)
        }

        else
        {
          toast.info(`something went wrong`)
        }
     
    }
   }


  
  return (
    
    <div className="register-bg d-flex justify-content-center align-items-center min-vh-100">



      <div className="container w-75 shadow-lg p-4 rounded-4" style={{ background: "rgba(255, 255, 255, 0.9)" }}>
        
        
        <div className="rounded-4 position-relative overflow-hidden" style={{ height: "60vh", backgroundImage: "url(https://apnmag.com/wp-content/uploads/2021/10/alin-surdu-j5gcqqm3eya-unsplash.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}>
          
         
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "rgba(0, 0, 0, 0.5)" }}></div>
          
          
          <h1 className="text-center text-white mt-5 pt-4 fw-bold position-relative">Create an Account</h1>

          
          <div className="d-flex justify-content-center align-items-center position-relative">
            
           
            <div className="col-md-5 text-center">
              <img src={registerimg} style={{ height: "250px" }} alt="Register Animation" className="img-fluid" />
            </div>

           
            <div className="col-md-6">
              <form className="p-4 rounded-4" style={{ background: "rgba(255, 255, 255, 0.8)" }}>
                
                {/* Username  */}
                <div className="mb-3">
                  <input type="text" value={userDetails.username} onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })} placeholder="Username" className="form-control shadow-sm rounded-3 p-2" />
                </div>

                {/* Email  */}
                <div className="mb-3">
                  <input type="email" value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} placeholder="Email" className="form-control shadow-sm rounded-3 p-2" />
                </div>
                
                {/* Password  */}
                <div className="mb-3">
                  <input type="password"  value={userDetails.password} onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })} placeholder="Password" className="form-control shadow-sm rounded-3 p-2" />
                </div>

                {/* Register  */}
                <button className="btn btn-warning w-100 fw-bold rounded-3 shadow-sm p-2" onClick={handleRegister} type='button'>REGISTER</button>

                <p className='text-danger text-end mt-1'><Link to ="/login">Already a user? Click HERE!</Link></p>
              </form>
            </div>
          </div>
        
        </div>
      </div>
      <ToastContainer  position="top-center" theme="light" autoClose={3000}/>
    </div>
  );
}

export default Register;
