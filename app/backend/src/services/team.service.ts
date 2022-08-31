import TeamModel from '../database/models/team.model';
import TeamStats from '../entities/teamstats';
import ITeam from '../interfaces/team.interface';
import MatchService from './match.service';

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

  public static async allTeamsStats() {
    const allMatches = await MatchService.getFinishedMatches() as any;
    const statsCreationPromise = allMatches.map(async (match: any) => {
      if (match.inProgress === true) return 0;
      const team = new TeamStats();
      await team.build(match.id);
      return team;
    });
    const statsCreation = await Promise.all(statsCreationPromise);
    const filteredStats = statsCreation.filter((el: any) => !!el.name);
    return filteredStats;
  }

  public static async orderTeamStats() {
    const unsortedMatches = await TeamService.allTeamsStats();
    const result = unsortedMatches.sort((a:any, b:any) => {
      if (a.totalPoints !== b.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (a.totalVictories !== b.totalVictories) {
        return b.totalVictories - a.totalVictories;
      }
      if (a.goalsBalance !== b.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }
      if (a.goalsFavor !== b.goalsBalance) return b.goalsFavor - a.goalsFavor;
      if (a.goalsOwn !== b.goalsBalance) return b.goalsFavor - a.goalsFavor;
      return 0;
    });
    return result;
  }
}

export default TeamService;
