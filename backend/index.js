import dotenv from "dotenv";
dotenv.config();
import path from "path";
import cors from "cors";
import express from "express";
import connectDB from "./database/db.js";
import { app, server } from "./lib/socket.js";
import authRoute from "./routes/auth.route.js";
import chatRoute from "./routes/chat.route.js";
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 4555;
const NODE_ENV = process.env.NODE_ENV || "development";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "10mb" }));
app.use(cors({origin: process.env.CLIENT_URL}));

//Routes
app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);

if(NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on PORT: ${PORT}`);
});
