import { Injectable } from "@nestjs/common";
import { DraftPicksDto, TeamDto } from "./app.dto";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  getHello(): string {
    return "Hello World!";
  }

  async getTeams(): Promise<TeamDto[]> {
    return (
      await this.httpService.axiosRef.get(
        "https://api.balldontlie.io/v1/teams",
        { headers: { Authorization: this.configService.get("API_KEY") } }
      )
    ).data.data.map((team) => ({ name: team.full_name, id: team.id }));
  }

  async getDraftRoundsForTeam(teamId: string): Promise<DraftPicksDto> {
    let cursor = 0;
    let allRounds = { 1: 0, 2: 0, null: 0 };

    while (true) {
      const players = await this.getPlayers(teamId, cursor);
      cursor = players.meta.next_cursor;
      players.data.forEach((player) => {
        allRounds[player.draft_round]++;
      });

      if (!cursor) break;
    }

    return {
      one: allRounds[1],
      two: allRounds[2],
      none: allRounds.null,
    };
  }

  async getDraftRoundsFromTeamName(teamName: string): Promise<DraftPicksDto> {
    const teams = await this.getTeams();
    return this.getDraftRoundsForTeam(
      teams.find((team) => team.name === teamName).id.toString()
    );
  }

  async getPlayers(teamId: string, cursor: number): Promise<any> {
    return (
      await this.httpService.axiosRef.get(
        // this would normally call the active players api, but that's not a part of the free tier, so it will return all past players as well
        `https://api.balldontlie.io/v1/players?team_ids[]=${teamId}&per_page=100&cursor=${cursor}`,
        { headers: { Authorization: this.configService.get("API_KEY") } }
      )
    ).data;
  }
}
