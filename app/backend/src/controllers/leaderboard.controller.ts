import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboard.services';

export default class LeaderboardController {
  public static async getOrderedTeamStats(_req: Request, res: Response) {
    try {
      const orderedTeamsStats = await LeaderboardService.getOrderedHomeTeamStats();
      return res.status(200).json(orderedTeamsStats);
    } catch (err) {
      return err instanceof Error && res.status(500)
        .json({ message: 'Something went wrong' });
    }
  }
}
