import * as Jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import ILoginUser from '../interfaces/loginUser.interface';

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
}
