import { Request, Response } from "express"
import Product from "../models/product"

class ProductsController {
    static async get(request: Request, response: Response): Promise<Product[]> {
        return await Product.getAll()
    }

    static async getById(request: Request, response: Response): Promise<Product | null> {
        const { id } = request.params
        return await Product.findByPk(Number(id))
    }

    static async create(request: Request, response: Response): Promise<Product[]> {
        return await Product.getAll()
    }

    static async update(request: Request, response: Response): Promise<Product[]> {
        return await Product.getAll()
    }

    static async delete(request: Request, response: Response): Promise<Product[]> {
        return await Product.getAll()
    }

}

export default ProductsController