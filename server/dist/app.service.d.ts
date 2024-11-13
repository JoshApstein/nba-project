import { DraftPicksDto, TeamDto } from "./app.dto";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
export declare class AppService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    getHello(): string;
    getTeams(): Promise<TeamDto[]>;
    getDraftRoundsForTeam(teamId: string): Promise<DraftPicksDto>;
    getDraftRoundsFromTeamName(teamName: string): Promise<DraftPicksDto>;
    getPlayers(teamId: string, cursor: number): Promise<any>;
}
