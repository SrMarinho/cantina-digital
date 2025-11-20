import { Request, Response } from "express"
import Product from "../models/product"

class ProductsController {
    static async get(request: Request, response: Response): Promise<Response> {
        try {
            const products = await Product.getAll();
            return response.json(products);
        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getById(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const product = await Product.findByPk(Number(id));
            
            if (!product) {
                return response.status(404).json({ error: 'Product not found' });
            }
            
            return response.json(product);
        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    static async create(request: Request, response: Response): Promise<Response> {
        try {
            console.log("Creating product with data:", request.body);
            const { name, price, description, isAvailable, imageUrl } = request.body;
            const product = await Product.create(name, price, isAvailable, description, imageUrl);
            return response.status(201).json(product);
        } catch (error) {
            console.log(error);
            
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    static async update(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const data = request.body;
            const product = await Product.update(Number(id), data);
            return response.json(product);
        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    static async delete(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            await Product.delete(Number(id));
            return response.status(204).send();
        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default ProductsController