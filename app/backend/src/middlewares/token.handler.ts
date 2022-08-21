import 'dotenv/config';
import * as Jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import UserModel from '../database/models/user.model';
import ILoginUser from '../interfaces/loginUser.interface';
import IUser from '../interfaces/user.interface';

export default class TokenHandler {
  public static handleToken(loginUser: ILoginUser) {
    const secret = process.env.JWT_SECRET as string;
    const jwtConfig: SignOptions = {
      expiresIn: '7d',
      algorithm: 'HS256',
    };
    const token = Jwt.sign({ data: loginUser }, secret, jwtConfig);
    return token;
  }

  public static async decodeToken(token: string): Promise<IUser | boolean> {
    const secret = process.env.JWT_SECRET as string;
    const decoded = Jwt.verify(token, secret) as Jwt.JwtPayload;

    const { email } = decoded.data;

    const user = await UserModel.findOne({
      where: { email },
    });

    if (!user) return false;
    return user;
  }
}
