import e from "express";
import { userSignup,userLogin,userProfile,userLogout } from "../controllers/usercontrollers.js";
import { userAuth } from "../middleware/userAuth.js";
import { upload } from "../middleware/upload.js";
import { uploadProfilePic } from "../controllers/usercontrollers.js";
const router = e.Router();
router.post("/upload-profile-pic", userAuth, upload.single("profilePic"), uploadProfilePic);
router.post("/signup",userSignup);

router.put("/login",userLogin);

router.get("/profile",userAuth,userProfile);

router.get("/logout",userAuth,userLogout);


export{router as userRouter};