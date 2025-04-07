import React, { useState } from 'react';
import loginphoto from "../assets/Animation - 1742099700803.gif";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AdminloginAPI } from '../Services/allApi';
import './AdminLogin.css';

function AdminLogin() {

    const navigate = useNavigate()
      const [userDetails, setUserDetails] = useState({
        username: "",
        password: ""
      })
    
      console.log(userDetails);
    
      const handleLogin = async () => {
        const { username, password } = userDetails
    
        if (!username || !password) {
          toast.info(`complete the LOGIN`)
        }
        else {
          // api 
          const result = await AdminloginAPI({ username, password })
          console.log(result);
    
          if (result.status >= 200 && result.status <=399) {
    
            toast.info(`login Successfull`)
    
            sessionStorage.setItem('existingAdmin', JSON.stringify(result.data.existingAdmin));
    
            sessionStorage.setItem('token', result.data.token);
    
            setUserDetails({
              username: "",
              password: ""
            })
    
            setTimeout(() => {
              navigate('/admin')
            }, 2000);
    
          }
          else if (result.status >= 400 && result.status < 500) {
            toast.info(result.response.data)
            setUserDetails(
              {
                username: "",
    
                password: ""
              })
          }
          else {
            toast.info(`something went wrong`)
            setUserDetails(
              {
                username: "",
    
                password: ""
              })
          }
    
        }
    
      }
    
  return (
   <div className="adminlogin-bg d-flex justify-content-center align-items-center min-vh-100">
         <div className="container w-75 shadow-lg p-4 rounded-4" style={{ background: "rgba(0, 0, 0, 0.7)" }}>
   
           {/* Background Image Section */}
           <div className="rounded-4 position-relative overflow-hidden" style={{ height: "60vh", backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr_IpgbIMnsFhzcy8ixAwzuTPoiocCQJpSoA&s)", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}>
   
             {/* Overlay */}
             <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "rgba(0, 0, 0, 0.5)" }}></div>
   
             {/* Title */}
             <h1 className="text-center text-white mt-5 pt-4 fw-bold position-relative">Welcome Back</h1>
   
             {/* Content Section */}
             <div className="d-flex justify-content-center align-items-center position-relative">
   
               {/* Left Side - Image */}
               <div className="col-md-5 text-center">
                 <img src={loginphoto} style={{ height: "250px" }} alt="Login Animation" className="img-fluid" />
               </div>
   
               {/* Right Side - Form */}
               <div className="col-md-6">
                 <form className="p-4 rounded-4" style={{ background: "rgba(0, 0, 0, 0.7)" }}>
   
                   {/* Username Field */}
                   <div className="mb-3">
                     <input type="text" placeholder="Username" value={userDetails.username} onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })} className="form-control shadow-sm rounded-3 p-2" />
                   </div>
   
                   {/* Password Field */}
                   <div className="mb-3">
                     <input type="password" placeholder="Password" value={userDetails.password} onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })} className="form-control shadow-sm rounded-3 p-2" />
                   </div>
   
                   {/* Login Button */}
                   <button type='button' onClick={handleLogin} className="btn btn-warning w-100 fw-bold rounded-3 shadow-sm p-2">   LOGIN  </button>
   
                   <p className='text-danger text-end mt-2'><Link to="/adminreg">New User ? CLICK HERE!</Link></p>
                 </form>
               </div>
             </div>
   
           </div>
         </div>
         <ToastContainer position="top-center" theme="dark" autoClose={5000} />
       </div>
  )
}

export default AdminLogin
