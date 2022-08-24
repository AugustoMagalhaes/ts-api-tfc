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

  public static async getTeamById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const numberId = Number(id);

      const team = await TeamService.getTeamById(numberId);

      if (!team) return res.status(404).json({ message: 'Team not found' });

      return res.status(200).json(team);
    } catch (err) {
      if (err instanceof Error) return res.status(500).json({ message: err.message });
    }
  }
}

export default TeamController;
