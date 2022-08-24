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
}

export default MatchController;
