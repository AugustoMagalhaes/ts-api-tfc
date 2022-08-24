import MatchModel from '../database/models/match.model';
import TeamModel from '../database/models/team.model';
import IMatch from '../interfaces/match.interface';

class MatchService {
  public static async getAllMatches()
  : Promise<IMatch[]> {
    const teams = await MatchModel.findAll({
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

    return teams as IMatch[];
  }
}

export default MatchService;
