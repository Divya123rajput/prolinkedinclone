import mongoose from "mongoose";


const educationSchema = mongoose.Schema({
    school: {
        type: String,
        default: ""

    },
    degree: {
        type: String,
        default: ""

    },
    fieldOfStudy: {
        type: String,
        default: "",

    },
});



const workSchema = mongoose.Schema({
    company: {
        type: String,
        default: ""

    },
    positions: {
        type: String,
        default: ""

    },
    years: {
        type: String,
        default: "",

    },
});


const profileSchema =new  mongoose.Schema({

    userId: {
        type: String,
        ref: "User"

    },
    bio: {
        type: String,
        default: ""

    },
    currentPost: {
        type: String,
        default: "",

    },
    pastWork: {
        type: [workSchema],
        default: [],
    },
    education: {
        type: [educationSchema],
        default: []
    }

}
);

const Profile = mongoose.model("Profile", profileSchema)
export default Profile;

