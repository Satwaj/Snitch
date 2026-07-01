import { Router } from 'express';
import { validateRegisterUser,validateLoginUser } from '../validators/auth.validator.js';
import { register,login, googleCallback,getMe,logout} from '../controllers/auth.controller.js'
import { authenticateUser } from '../middlewares/auth.middleware.js';
import passport from "passport";
import {config} from "../config/config.js"



const router = Router();

router.post('/register', validateRegisterUser, register);

router.post('/login',validateLoginUser, login)

router.get("/me",authenticateUser, getMe)


router.post("/logout", authenticateUser, logout)

// /api/auth/google
router.get("/google",
    passport.authenticate("google", { scope: [ "profile", "email" ],session: false, }))

router.get("/google/callback",
    passport.authenticate("google", { 
        session: false,
        failureRedirect:config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"
     },),
    googleCallback,
)

  
export default router;