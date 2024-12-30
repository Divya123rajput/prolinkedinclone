import { Router } from "express";
import { activeCheck, createPost, deletePost, getAllPosts, commentPost, get_comments_by_post, delete_comment_of_user, increment_likes } from "../controllers/posts.controller.js";
import multer from "multer";
const router = Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage: storage })




router.route('/').get(activeCheck);
router.route("/post").post(upload.single("media"), createPost)
router.route('/delete_post').delete(deletePost)
router.route('/posts').get(getAllPosts)

router.route('/comments').post(commentPost)
router.route('/get_comments').get(get_comments_by_post)
router.route('/delete_comments').post(delete_comment_of_user)
router.route('/increment_post_likes').post(increment_likes)


export default router; 