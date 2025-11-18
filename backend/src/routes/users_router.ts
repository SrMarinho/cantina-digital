import express from "express";
import { Request, Response } from "express";
import UsersController from "../controllers/users_controller";

const users_router = express.Router();

users_router.get("/", UsersController.getAllUsers);
users_router.get("/:id", UsersController.getAllUsers);
users_router.post("/", UsersController.createUser);

export default users_router;
