import react, { createContext, useState } from "react"


// this is creating context using create context()
export const addResponseContext = createContext({})
export const editResponseContext = createContext({})
// export const loginResponseContext = createContext({})

function ContextSharing({ children }) {

    // creating a state for the response 
    const [addResponse, setAddResponse] = useState([])
    const [editResponse, setEditResponse] = useState([]) // Fix the typo here

    // const [loginResponse , setLoginResponse] = useState(true)
    return (
        <>

            <addResponseContext.Provider value={{ addResponse, setAddResponse }}>
               <editResponseContext.Provider value={{editResponse , setEditResponse}}>
                    

                    {children}

                    </editResponseContext.Provider>
                    
                    
                    
                

            </addResponseContext.Provider>

            {/* here we wrapped the children in addResponseContext so tht addResponseContext can access the children */}



        </>
    )
}

export default ContextSharing

// we created context sahring because it is a type of data sharing we previoulsy learned few methods such as passing data as props , statelifting and redux
// context sharing is a new method to share the datas between the components
// we created this to share the data because while adding a new project it deosnt automatically comes into the ui only while we refreshes the site the project will be shown in the ui.
