import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import aiRoutes from "./src/routes/ai.routes.js"
const app = express();
dotenv.config()

//initialize server
initializeServer();

function initializeServer() {
    // 1. Middleware
    app.use(express.json());
    app.use(cors());
  
    // 2. Routes
    app.use('/api/ai', aiRoutes)
  
    // 3. Server Startup
    const port = process.env.PORTDAYONE;
    
    const server = app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  
    // 4. Error Handling (Fixed the typo here)
    server.on("error", (error) => {
      error.code === "EADDRINUSE"
        ? console.log(`Port: ${port} already in use. Close the other process!`)
        : console.log("Server Error:", error);
    });
  };
