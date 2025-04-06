import { commonApi } from "./CommonApi";
import { serverUrl } from "./ServerUrl";


// this is the api for register
export const registerAPI = async (reqBody) =>
    {
        return await commonApi("POST" , `${serverUrl}/register` , reqBody,"")
    }

    // this ist the api for login 
    export const loginAPI = async (reqBody) =>
        {
            return await commonApi ("POST" , `${serverUrl}/login` , reqBody,"")
        }

        export const AdminregisterAPI = async (reqBody) =>
            {
                return await commonApi("POST" , `${serverUrl}/adminregister` , reqBody,"")
            }

        export const AdminloginAPI = async (reqBody) =>
            {
                return await commonApi ("POST" , `${serverUrl}/adminlogin` , reqBody,"")
            }

        
    // to add our favourtie movie
    export const addMovieAPI = async (reqBody , reqHeader) =>
    {
        return await commonApi("POST" , `${serverUrl}/add-movies` , reqBody , reqHeader)
    }

    // to add our favourtie series
    export const addSeriesAPI = async (reqBody , reqHeader) =>
        {
            return await commonApi("POST" , `${serverUrl}/add-series` , reqBody , reqHeader)
        }


        // to get users favourite  movies
        export const getUserMoviesAPI = async (reqHeader)=>
        {
            return await commonApi("GET" , `${serverUrl}/user-movies` , "" ,reqHeader )
        }

         // to get users favourite  series
         export const getUserSeriesAPI = async (reqHeader)=>
            {
                return await commonApi("GET" , `${serverUrl}/user-series` , "" ,reqHeader )
            }

            

              // to remove user fav series
         export const deleteUserMoviesAPI = async (id , reqHeader)=>
            {
                return await commonApi("DELETE" , `${serverUrl}/remove-usermovies/${id}` , {} ,reqHeader )
            }

            // to remove user fav series
            export const deleteUserSeriesAPI = async (id , reqHeader)=>
                {
                    return await commonApi("DELETE" , `${serverUrl}/remove-userseries/${id}` , {} ,reqHeader )
                }

            
                export const updateUserMoviesAPI =  async(id ,reqBody ,reqHeader) =>
                    {
                        return await commonApi("PUT" , `${serverUrl}/update-usermovies/${id}`,reqBody,reqHeader)
                    }

                    export const updateUserSeriesAPI =  async(id ,reqBody ,reqHeader) =>
                        {
                            return await commonApi("PUT" , `${serverUrl}/update-userseries/${id}`,reqBody,reqHeader)
                        }
                    
         