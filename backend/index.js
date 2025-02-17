import dotenv from "dotenv";
dotenv.config();
import path from "path";
import cors from "cors";
import express from "express";
import connectDB from "./database/db.js";
import { app, server } from "./lib/socket.js";
import authRoute from "./routes/auth.route.js";
import chatRoute from "./routes/chat.route.js";

const _dirname = path.resolve();
const PORT = process.env.PORT || 4555;
const NODE_ENV = process.env.NODE_ENV || "development";

app.use(express.json({ limit: "10mb" }));
app.use(cors({origin: process.env.CLIENT_URL}));

//Routes
app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);

if(NODE_ENV === "production"){
  app.use(express.static(path.join(_dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend","dist", "index.html"));
  });
}

//Server Live
server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on PORT: ${PORT}`);
});
