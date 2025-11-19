import express from "express"

const auth_router = express.Router()

auth_router.post("/register", (req, res) => {
    res.json({message: "register route"})
})

auth_router.post("/login", (req, res) => {
    res.json({message: "login route"})
})

export default auth_router