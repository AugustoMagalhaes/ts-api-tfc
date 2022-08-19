import { Request, Response } from 'express';
import TokenHandler from '../middlewares/token.handler';
import UserService from '../services/user.service';

class UserController {
  public static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const login = await UserService.login(email, password);

      const token = TokenHandler.handleToken({ email, password });

      if (!login) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ token });
    } catch (err) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
}

export default UserController;
