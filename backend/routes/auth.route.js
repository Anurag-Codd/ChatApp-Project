import express from "express"
import { authenticateUser, login,  signup, updateProfile, updateStatus } from "../controller/user.controller.js"
import authenticate from "../middleware/auth.middleware.js"

const Router = express.Router()

Router.post("/signup",signup )
Router.post("/login",login )
Router.put("/update-profile",authenticate,updateProfile )
Router.put("/update-status",authenticate,updateStatus )
Router.get("/authenticate-user",authenticate,authenticateUser )

export default Router