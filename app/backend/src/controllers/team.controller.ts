import { Request, Response } from 'express';
import TeamService from '../services/team.service';

class TeamController {
  public static async getAllTeams(req: Request, res: Response) {
    try {
      const teams = await TeamService.getAllTeams();
      return res.status(200).json(teams);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
}

export default TeamController;
