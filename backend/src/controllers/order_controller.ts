import { Request, Response } from 'express';
import { OrderService } from '../services/order_service';

class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const { user_id, items } = req.body;

      const order = await OrderService.createOrderWithValidation(user_id, items);

      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderWithDetails(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserOrders(req: Request, res: Response) {
    try {
      const { user_id } = req.params;
      const orders = await OrderService.getUserOrders(user_id);

      res.json({
        success: true,
        data: orders
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new OrderController();