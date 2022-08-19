import { INTEGER, Model, STRING } from 'sequelize';
import db from '.';
import IUSER from '../../interfaces/user.interface';

class UserModel extends Model implements IUSER {
  public id!: number;
  public username!: string;
  public role!: string;
  public email!: string;
  public password!: string;
}

UserModel.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: STRING,
    allowNull: false,
  },
  role: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
}, {
  underscored: false,
  sequelize: db,
  modelName: 'users',
  timestamps: false,
});

export default UserModel;
