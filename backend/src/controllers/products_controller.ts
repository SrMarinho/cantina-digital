import { Request, Response } from "express"
import Product from "../models/product"

class ProductsController {
    static async getAll(request: Request, response: Response): Promise<Product[]> {
        return await Product.getAll()
    }
}

export default ProductsController