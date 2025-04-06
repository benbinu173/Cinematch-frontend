import axios from "axios";

export const commonApi =  async (httpRequest , url ,reqBody , reqHeader) =>
{
    const config = {
        method : httpRequest,
        url,
        data : reqBody,
        headers : reqHeader ? reqHeader : {"Content-type" : "application/json"}
    }

    return await axios(config).then((result) =>{
        return result

    }).catch((err) =>
    {
        return err
    })
}