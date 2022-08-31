import TeamService from './team.service';

export default class LeaderboardService {
  public static async getOrderedHomeTeamStats() {
    const orderedTeamStats = await TeamService.orderTeamStats();
    return orderedTeamStats;
  }
}
