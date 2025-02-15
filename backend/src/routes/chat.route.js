import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import { getChat, contactUsers, sendMessage } from "../controller/chat.controller.js";

const Route = express.Router();

Route.get("/users", authenticate, contactUsers);
Route.get("/:id", authenticate, getChat);
Route.post("/send/:id",authenticate,sendMessage);

export default Route;
