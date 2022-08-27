import { Request, Response } from 'express';
import MatchService from '../services/match.service';

class MatchController {
  public static async getAllMatches(_req: Request, res: Response) {
    try {
      const matches = await MatchService.getAllMatches();
      return res.status(200).json(matches);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }

  public static async createMatch(req: Request, res: Response) {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = req.body;
    const { authorization: token } = req.headers;

    try {
      const validation = await MatchService.validate(token as string);
      if (!validation) return res.status(401).json({ message: 'Token must be a valid token' });
      const hasTeams = await MatchService.checkTeamsInDb(homeTeam, awayTeam);

      if (!hasTeams) return res.status(404).json({ message: 'There is no team with such id!' });

      const hasMatch = await MatchService.checkRepeatedTeam(homeTeam, awayTeam);
      if (hasMatch) {
        return res.status(401)
          .json({ message: 'It is not possible to create a match with two equal teams' });
      }

      const newMatch = await MatchService
        .createMatch(homeTeam, homeTeamGoals, awayTeam, awayTeamGoals);

      return res.status(201).json(newMatch);
    } catch (err) {
      return err instanceof Error && res.status(401).json({ message: err.message });
    }
  }

  public static async finishMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const numId = Number(id);
      const updateMatch = await MatchService.finishMatch(numId);
      if (!updateMatch) throw new Error('Cannot update missing id');

      return res.status(200).json({ message: 'Finished' });
    } catch (err) {
      return err instanceof Error && res.status(500).json({ message: err.message });
    }
  }

  public static async changeMatchScore(req: Request, res: Response) {
    try {
      const { homeTeamGoals, awayTeamGoals } = req.body;
      const { id } = req.params;
      const numId = Number(id);

      const updateMatchGoals = await MatchService
        .changeMatchScore(numId, homeTeamGoals, awayTeamGoals);

      if (!updateMatchGoals) throw new Error('Cannot find match id');

      return res.status(200).json({ homeTeamGoals, awayTeamGoals });
    } catch (err) {
      return err instanceof Error && res.status(500).json({ message: err.message });
    }
  }
}

export default MatchController;
