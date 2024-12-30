const {default: axios} = require("axios")



export const  base_URL = "https://prolinkedinclone-2.onrender.com"



 export const clientserver = axios.create({
    baseURL:  base_URL,
})