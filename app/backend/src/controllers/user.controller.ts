import { Request, Response } from 'express';
import TokenHandler from '../middlewares/token.handler';
import Validations from '../middlewares/validations';
import UserService from '../services/user.service';

class UserController {
  public static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const validationError = await Validations.loginValidation(email, password);

      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      const login = await UserService.login(email, password);

      const token = TokenHandler.handleToken({ email, password });

      if (!login) {
        return res.status(401).json({ message: 'Incorrect email or password' });
      }
      return res.status(200).json({ token });
    } catch (err) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
}

export default UserController;
