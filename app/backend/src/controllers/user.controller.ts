import { Request, Response } from 'express';
import TokenHandler from '../middlewares/token.handler';
import UserService from '../services/user.service';

class UserController {
  public static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log(req.body);
    const login = await UserService.login(email, password);

    const token = TokenHandler.handleToken({ email, password });

    if (login) {
      return res.status(200).json({ token });
    }
  }
}

export default UserController;
