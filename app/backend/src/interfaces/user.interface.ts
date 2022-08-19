import ILoginUser from './loginUser.interface';

export default interface IUser extends ILoginUser {
  id?: number,
  username: string,
  role: string,
}
