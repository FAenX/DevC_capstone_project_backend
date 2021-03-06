import path from "path";
import express from "express";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import cors from "cors";


import swaggerDef from "./config/swaggerDef";


import userRoutes from "./routes/users";
import gifRoutes from "./routes/gifs";
import articleRoutes from "./routes/articles";
import feedRoutes from "./routes/feed";
import commentRoutes from "./routes/comments";


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use("/swagger.yaml", (req, res) => {
  res.send(swaggerDef.swaggerSpec);
});

app.use("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "../redoc.html"));
});


app.use("/api/v1/auth/", userRoutes);
app.use("/api/v1/gifs/", gifRoutes);
app.use("/api/v1/articles/", articleRoutes);
app.use("/api/v1/feed/", feedRoutes);
app.use("/api/v1/comments/", commentRoutes);

export default app;
