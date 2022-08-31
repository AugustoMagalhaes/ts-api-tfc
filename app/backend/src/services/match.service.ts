import MatchModel from '../database/models/match.model';
import TeamModel from '../database/models/team.model';
import IMatch from '../interfaces/match.interface';
import ITeam from '../interfaces/team.interface';
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

  public static async checkTeamsInDb(homeTeam: number, awayTeam: number) {
    const allTeams = await TeamModel.findAll();

    const allIds = allTeams.map((el: ITeam) => el.id);
    const hasIds = allIds.includes(homeTeam) && allIds.includes(awayTeam);

    return hasIds;
  }

  public static async changeMatchScore(id: number, homeTeamGoals: number, awayTeamGoals: number) {
    const match = await MatchModel.findOne({ where: { id } });

    if (!match) return null;

    match.set({
      homeTeamGoals,
      awayTeamGoals,
    });

    await match.save();
    return match;
  }

  public static async getFinishedMatches() {
    const finishedMatches = await MatchModel.findAll({
      where: { inProgress: false },
      include: [{
        model: TeamModel,
        as: 'teamHome',
        attributes: ['teamName'],
      },
      { model: TeamModel,
        as: 'teamAway',
        attributes: ['teamName'],
      }],
      attributes: { exclude: ['inProgress'] },
    });
    return finishedMatches;
  }

  public static async getFinishedMatchesByHomeTeam(homeTeamId: number) {
    const allFinishedMatches = await MatchService.getFinishedMatches();
    const homeTeamFinishedMatches = allFinishedMatches
      .filter((match) => match.homeTeam === homeTeamId);
    return homeTeamFinishedMatches;
  }
}

export default MatchService;
