import express from "express"
import auth_controller from "../../controllers/auth_controller"

const auth_router = express.Router()

auth_router.post("/register", auth_controller.register)

auth_router.post("/login", auth_controller.login)

export default auth_router