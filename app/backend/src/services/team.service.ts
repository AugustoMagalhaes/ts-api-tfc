import TeamModel from '../database/models/team.model';
import ITeam from '../interfaces/team.interface';

class TeamService {
  public static async getAllTeams()
  : Promise<ITeam[]> {
    const teams = await TeamModel.findAll();

    return teams as ITeam[];
  }
}

export default TeamService;
