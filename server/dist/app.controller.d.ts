import { AppService } from "./app.service";
import { DraftPicksDto, TeamDto } from "./app.dto";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getTeams(): Promise<TeamDto[]>;
    getTeamDraftPicksFromId(teamId: string): Promise<DraftPicksDto>;
    getTeamDraftPicksFromTeamName(teamName: string): Promise<DraftPicksDto>;
}
