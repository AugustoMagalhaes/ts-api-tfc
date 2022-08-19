import UserModel from '../database/models/user.model';
import ILoginUser from '../interfaces/loginUser.interface';
import DecryptHandler from '../middlewares/decrypt.handler';

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
}

export default UserService;
