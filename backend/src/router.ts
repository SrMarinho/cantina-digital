import express from "express"
import passport from "passport"
import auth_router from "./routes/public/auth"

const router = express.Router()

router.use("/auth", auth_router)

export default router