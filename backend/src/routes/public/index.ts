import express from "express"
import auth_router from "./auth"


const public_router = express.Router()

public_router.use("/auth", auth_router)

export default public_router