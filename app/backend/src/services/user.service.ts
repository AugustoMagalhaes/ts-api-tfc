import UserModel from '../database/models/user.model';
import ILoginUser from '../interfaces/loginUser.interface';
import IUser from '../interfaces/user.interface';
import DecryptHandler from '../middlewares/decrypt.handler';
import TokenHandler from '../middlewares/token.handler';

class UserService {
  public static async getUserByEmail(email: string)
    : Promise<ILoginUser> {
    const user = await UserModel.findOne({
      where: { email },
    });

    return user as ILoginUser;
  }

  public static async login(email: string, password: string): Promise<boolean> {
    const user = await UserService.getUserByEmail(email);

    if (!user) return false;

    const comparison = await DecryptHandler.decrypt(password, user.password);
    if (comparison) return true;
    return false;
  }

  public static async validate(token: string): Promise<IUser> {
    const user = await TokenHandler.decodeToken(token) as IUser;
    return user;
  }
}

export default UserService;
