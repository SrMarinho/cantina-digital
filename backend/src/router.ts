import express from "express";
import users_router from "./routes/users_router";

var router = express.Router();

router.use("/users", users_router);

export default router;