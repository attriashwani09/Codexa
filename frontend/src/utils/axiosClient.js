import axios from "axios" ; 

const axiosClent = axios.create({
    baseURL : 'https://codexa-backend-d09a.onrender.com' , 
    withCredentials : true , 
    headers : {
        "Content-Type" : 'application/json'
    }
}) 

export default axiosClent ;
