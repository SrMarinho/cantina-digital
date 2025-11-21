import 'dotenv/config';
import express from "express";
import cors from "cors"
import router from "./router";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

app.use(router)

// Routes
app.use("/api", router);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
