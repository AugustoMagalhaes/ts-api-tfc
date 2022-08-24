import TeamModel from '../database/models/team.model';
import ITeam from '../interfaces/team.interface';

class TeamService {
  public static async getAllTeams()
  : Promise<ITeam[]> {
    const teams = await TeamModel.findAll();

    return teams as ITeam[];
  }

  public static async getTeamById(id: number): Promise<ITeam> {
    const team = await TeamModel.findOne({ where: { id } });
    return team as ITeam;
  }
}

export default TeamService;
