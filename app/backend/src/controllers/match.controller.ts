import { Request, Response } from 'express';
import MatchService from '../services/match.service';

class MatchController {
  public static async getAllTeams(_req: Request, res: Response) {
    try {
      const matches = await MatchService.getAllMatches();
      return res.status(200).json(matches);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }

  public static async createMatch(req: Request, res: Response) {
    try {
      const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = req.body;
      const { authorization: token } = req.headers;

      const validation = await MatchService.validate(token as string);

      if (!validation) throw new Error('Invalid token');

      const newMatch = await MatchService
        .createMatch(homeTeam, homeTeamGoals, awayTeam, awayTeamGoals);

      return res.status(201).json(newMatch);
    } catch (err) {
      console.log(err);
      return err instanceof Error && res.status(500).json({ message: err.message });
    }
  }
}

export default MatchController;
