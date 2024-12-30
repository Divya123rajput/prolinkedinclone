import { Router } from "express";
import {  downloadProfile, getUserProfileBasedOnUsername, register, sendConnectionRequest} from "../controllers/users.controller.js";
import { login} from "../controllers/users.controller.js"
import { updateProfilePicture} from "../controllers/users.controller.js"
import { updateUserProfile} from "../controllers/users.controller.js"
import { getUserAndProfile} from "../controllers/users.controller.js"
import {updateProfileData } from "../controllers/users.controller.js"
import {getAllUserProfile} from "../controllers/users.controller.js"
import {getConnectionRequest} from "../controllers/users.controller.js"
import {whatAreMyConnections} from "../controllers/users.controller.js"
import {acceptConnectionRequest} from "../controllers/users.controller.js"


import multer from 'multer'


const router = Router();


const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb) =>{
        cb(null,  file.originalname)
    },
})

const upload = multer({storage:storage})
router.route("/update_profile_picture").post(upload.single("profilePicture"),updateProfilePicture)
router.route('/register').post(register);
router.route('/login').post(login);
router.route("/user_update").post(updateUserProfile)
router.route("/get_user_and_profile").get(getUserAndProfile) 
router.route("/update_profile_data").post(updateProfileData)
router.route("/user/get_all_users").get(getAllUserProfile)
router.route("/user/download_resume").get(downloadProfile)
router.route("/user/send_connection_request").post(sendConnectionRequest) 
router.route("/user/getConnectionRequests").get(getConnectionRequest)
router.route("/user/user_connection_request").get( whatAreMyConnections)
router.route("/user/accept_connection_request").post(acceptConnectionRequest)
router.route("/user/get_profile_based_on_username").get(getUserProfileBasedOnUsername)

export  default router; 