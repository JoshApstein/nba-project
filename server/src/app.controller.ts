import { Controller, Get, Param, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { DraftPicksDto, TeamDto } from "./app.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/teams")
  getTeams(): Promise<TeamDto[]> {
    return this.appService.getTeams();
  }

  @Get("draftPicks/:teamId")
  async getTeamDraftPicksFromId(
    @Param("teamId") teamId: string
  ): Promise<DraftPicksDto> {
    return this.appService.getDraftRoundsForTeam(teamId);
  }

  @Get("draftPicks/:teamName")
  async getTeamDraftPicksFromTeamName(
    @Param("teamName") teamName: string
  ): Promise<DraftPicksDto> {
    return this.appService.getDraftRoundsFromTeamName(teamName);
  }
}
