const {default: axios} = require("axios")



export const  base_URL = "http://localhost:9080"



 export const clientserver = axios.create({
    baseURL:  base_URL,
})