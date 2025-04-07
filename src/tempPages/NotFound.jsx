import React from 'react'
import ErrorMsg from "../assets/6325257.jpg"

function NotFound() {
  return (
    <div>
      
      <div className='d-flex justify-content-center align-items-center mt-5 pt-5'>

          <img src={ErrorMsg} style={{width: "40%" , maxWidth:"600px"}} alt="404 error msg" />

      </div>

    </div>
  )
}

export default NotFound
