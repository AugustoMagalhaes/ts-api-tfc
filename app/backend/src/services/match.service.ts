import MatchModel from '../database/models/match.model';
import TeamModel from '../database/models/team.model';
import IMatch from '../interfaces/match.interface';
import IUser from '../interfaces/user.interface';
import TokenHandler from '../middlewares/token.handler';

class MatchService {
  public static async getAllMatches()
  : Promise<IMatch[]> {
    const matches = await MatchModel.findAll({
      include: [{
        model: TeamModel,
        as: 'teamHome',
        attributes: ['teamName'],
      },
      { model: TeamModel,
        as: 'teamAway',
        attributes: ['teamName'],
      }],
    });

    return matches as IMatch[];
  }

  public static async validate(token: string): Promise<boolean> {
    const user = await TokenHandler.decodeToken(token) as IUser;
    return !!user;
  }

  public static async createMatch(
    homeTeam: number,
    homeTeamGoals: number,
    awayTeam: number,
    awayTeamGoals: number,
  ) {
    const newMatch = await MatchModel.create({ homeTeam,
      homeTeamGoals,
      awayTeam,
      awayTeamGoals,
      inProgress: 1 });

    if (!newMatch) return null;

    const { id, inProgress } = newMatch;
    return { id, homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress };
  }

  public static async finishMatch(id: number) {
    const match = await MatchModel.findOne({ where: { id } });
    if (!match) return null;

    match.set({
      inProgress: false,
    });

    await match.save();
    return match;
  }

  public static async checkRepeatedTeam(homeTeam: number, awayTeam: number) {
    return homeTeam === awayTeam;
  }
}

export default MatchService;
