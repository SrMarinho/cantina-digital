import express from "express"
import ProductsController from "../../controllers/products_controller"

const products_router = express.Router()

products_router.get("/", ProductsController.get)
products_router.get("/:id", ProductsController.getById)
products_router.post("/", ProductsController.create)

export default products_router