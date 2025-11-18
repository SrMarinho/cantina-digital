import express from "express";
import cors from "cors";
import router from "./router";

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", router);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
