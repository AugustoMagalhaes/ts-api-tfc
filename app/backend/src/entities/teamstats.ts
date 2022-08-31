import MatchService from '../services/match.service';

export default class TeamStats {
  private name: string;
  private totalPoints = 0;
  private totalGames = 0;
  private totalVictories = 0;
  private totalDraws = 0;
  private totalLosses = 0;
  private goalsFavor = 0;
  private goalsOwn = 0;
  private goalsBalance = 0;
  private efficiency = '';

  public async build(id: number): Promise<TeamStats> {
    const allFinishedMatches = await MatchService.getFinishedMatchesByHomeTeam(id);
    await this.setTeamResults(allFinishedMatches);
    await this.setTeamGoalsStats(allFinishedMatches);
    return new TeamStats();
  }

  private async setTeamResults(allFinishedMatches: any[]) {
    allFinishedMatches.forEach((match: any) => {
      if (!this.name) this.name = match.teamHome.teamName;

      if (match.homeTeamGoals > match.awayTeamGoals) {
        this.totalVictories += 1;
        this.totalPoints += 3;
      } else if (match.homeTeamGoals === match.awayTeamGoals) {
        this.totalDraws += 1;
        this.totalPoints += 1;
      } else {
        this.totalLosses += 1;
      }
      this.totalGames += 1;
    });
  }

  private async setTeamGoalsStats(allFinishedMatches: any[]) {
    allFinishedMatches.forEach((match: any) => {
      this.goalsFavor += match.homeTeamGoals;
      this.goalsOwn += match.awayTeamGoals;
    });

    this.goalsBalance = this.goalsFavor - this.goalsOwn;
    this.efficiency = (100 * (this.totalPoints / (this.totalGames * 3))).toFixed(2);
  }
}
