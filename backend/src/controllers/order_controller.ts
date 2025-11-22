import { Request, Response } from 'express';
import { OrderService } from '../services/order_service';


interface User {
  userId: string;
}

interface UserRequest extends Request {
  user?: User;
}


class OrderController {
  async createOrder(req: UserRequest, res: Response) {
    try {
      const { user } = req;
      const user_id = user?.userId;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário não fornecido'
        });
      }
      const { items } = req.body;

      console.log(items);
      

      // const order = await OrderService.createOrderWithValidation(user_id, items);
      const order: any[] = []

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

  async getUserOrders(req: UserRequest, res: Response) {
    try {
      const { user } = req;
      const user_id = user?.userId;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário não fornecido'
        });
      }
      
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