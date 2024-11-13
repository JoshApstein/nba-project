"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
let AppService = class AppService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    getHello() {
        return "Hello World!";
    }
    async getTeams() {
        return (await this.httpService.axiosRef.get("https://api.balldontlie.io/v1/teams", { headers: { Authorization: this.configService.get("API_KEY") } })).data.data.map((team) => ({ name: team.full_name, id: team.id }));
    }
    async getDraftRoundsForTeam(teamId) {
        let cursor = 0;
        let allRounds = { 1: 0, 2: 0, null: 0 };
        while (true) {
            const players = await this.getPlayers(teamId, cursor);
            cursor = players.meta.next_cursor;
            players.data.forEach((player) => {
                allRounds[player.draft_round]++;
            });
            if (!cursor)
                break;
        }
        return {
            one: allRounds[1],
            two: allRounds[2],
            none: allRounds.null,
        };
    }
    async getDraftRoundsFromTeamName(teamName) {
        const teams = await this.getTeams();
        return this.getDraftRoundsForTeam(teams.find((team) => team.name === teamName).id.toString());
    }
    async getPlayers(teamId, cursor) {
        return (await this.httpService.axiosRef.get(`https://api.balldontlie.io/v1/players?team_ids[]=${teamId}&per_page=100&cursor=${cursor}`, { headers: { Authorization: this.configService.get("API_KEY") } })).data;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], AppService);
//# sourceMappingURL=app.service.js.map