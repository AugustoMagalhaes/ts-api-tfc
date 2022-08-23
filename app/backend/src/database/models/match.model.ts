import { BOOLEAN, INTEGER, Model } from 'sequelize';
import db from '.';
import IMatch from '../../interfaces/match.interface';
import TeamModel from './team.model';

class MatchModel extends Model implements IMatch {
  public id!: number;
  public homeTeam!: number;
  public homeTeamGoals!: number;
  public awayTeam!: number;
  public awayTeamGoals!: number;
  public inProgress!: boolean;
}

MatchModel.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeam: {
    type: INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeam: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: BOOLEAN,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

TeamModel.belongsTo(MatchModel, { foreignKey: 'homeTeam', as: 'teamHome' });
TeamModel.belongsTo(MatchModel, { foreignKey: 'awayTeam', as: 'teamAway' });

MatchModel.hasMany(TeamModel, { foreignKey: 'homeTeam', as: 'teamHome' });
MatchModel.hasMany(TeamModel, { foreignKey: 'awayTeam', as: 'teamAway' });

export default MatchModel;
