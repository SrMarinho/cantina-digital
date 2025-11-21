import express from "express"
import public_router from "./routes/public"
import protected_router from "./routes/protected"

const router = express.Router()

router.use(public_router)
router.use(protected_router)

export default router
