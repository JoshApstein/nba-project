import { HttpModule, HttpService } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { mockDeep } from "jest-mock-extended";

describe("AppService", () => {
  let appService: AppService;

  let axiosInstance;
  beforeEach(async () => {
    axiosInstance = mockDeep<AxiosInstance>();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppService],
      providers: [
        {
          provide: HttpService,
          useValue: {
            axiosRef: axiosInstance,
          },
        },
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  it("should be defined", () => {
    expect(appService).toBeDefined();
  });

  describe("getTeams", () => {
    const data = {
      data: [
        {
          id: 1,
          conference: "East",
          division: "Southeast",
          city: "Atlanta",
          name: "Hawks",
          full_name: "Atlanta Hawks",
          abbreviation: "ATL",
        },
        {
          id: 2,
          conference: "East",
          division: "Southeast",
          city: "Cleveland",
          name: "Cavaliers",
          full_name: "Cleveland Cavaliers",
          abbreviation: "CLE",
        },
      ],
    };
    const response: AxiosResponse<any> = {
      data,
      headers: {},
      config: {
        url: "https://api.balldontlie.io/v1/teams",
        headers: {} as any,
      },
      status: 200,
      statusText: "OK",
    };

    beforeEach(() => {
      axiosInstance.get.mockResolvedValue(response);
    });

    it("should return team names and ids", async () => {
      expect(await appService.getTeams()).toEqual([
        { name: "Atlanta Hawks", id: 1 },
        { name: "Cleveland Cavaliers", id: 2 },
      ]);
    });
  });

  describe("getDraftRoundsForTeam", () => {
    it("should return aggregated draft rounds", async () => {
      const firstResponse: AxiosResponse<any> = {
        data: {
          meta: { next_cursor: 100 },
          data: [
            {
              id: 19,
              first_name: "Stephen",
              last_name: "Curry",
              draft_year: 2009,
              draft_round: 1,
              draft_number: 7,
              team: {
                id: 10,
                conference: "West",
                division: "Pacific",
                city: "Golden State",
                name: "Warriors",
                full_name: "Golden State Warriors",
                abbreviation: "GSW",
              },
            },
            {
              id: 99,
              first_name: "Michael",
              last_name: "Jordan",
              draft_year: 2009,
              draft_round: 2,
              draft_number: 7,
              team: {
                id: 10,
                conference: "West",
                division: "Pacific",
                city: "Golden State",
                name: "Warriors",
                full_name: "Golden State Warriors",
                abbreviation: "GSW",
              },
            },
          ],
        },
        headers: {},
        config: {
          url: "https://api.balldontlie.io/v1/teams",
          headers: {} as any,
        },
        status: 200,
        statusText: "OK",
      };
      const secondResponse = {
        ...firstResponse,
        data: {
          meta: {},
          data: [
            {
              id: 110,
              first_name: "Kobe",
              last_name: "Bryant",
              draft_year: 2009,
              draft_round: 1,
              draft_number: 7,
              team: {
                id: 10,
                conference: "West",
                division: "Pacific",
                city: "Golden State",
                name: "Warriors",
                full_name: "Golden State Warriors",
                abbreviation: "GSW",
              },
            },
            {
              id: 99,
              first_name: "Shaquille",
              last_name: "O'neill",
              draft_year: 2009,
              draft_round: null,
              draft_number: 7,
              team: {
                id: 10,
                conference: "West",
                division: "Pacific",
                city: "Golden State",
                name: "Warriors",
                full_name: "Golden State Warriors",
                abbreviation: "GSW",
              },
            },
          ],
        },
      };

      axiosInstance.get
        .mockResolvedValueOnce(firstResponse)
        .mockResolvedValueOnce(secondResponse);
      const results = await appService.getDraftRoundsForTeam("10");
      expect(axiosInstance.get).toHaveBeenCalledTimes(2);
      expect(results).toEqual({
        one: 2,
        two: 1,
        none: 1,
      });
    });
  });

  describe("getDraftRoundsFromTeamName", () => {
    it("should return aggregated draft rounds", async () => {
      const teamsResponse: AxiosResponse<any> = {
        headers: {},
        config: {
          url: "https://api.balldontlie.io/v1/teams",
          headers: {} as any,
        },
        status: 200,
        statusText: "OK",
        data: {
          data: [
            {
              id: 1,
              conference: "East",
              division: "Southeast",
              city: "Atlanta",
              name: "Hawks",
              full_name: "Atlanta Hawks",
              abbreviation: "ATL",
            },
            {
              id: 10,
              conference: "West",
              division: "Pacific",
              city: "Golden State",
              name: "Warriors",
              full_name: "Golden State Warriors",
              abbreviation: "GSW",
            },
          ],
        },
      };
      const firstResponse: AxiosResponse<any> = {
        data: {
          meta: { next_cursor: 100 },
          data: [
            {
              id: 19,
              first_name: "Stephen",
              last_name: "Curry",
              draft_year: 2009,
              draft_round: 1,
              draft_number: 7,
              team: {
                id: 10,
                conference: "West",
                division: "Pacific",
                city: "Golden State",
                name: "Warriors",
                full_name: "Golden State Warriors",
                abbreviation: "GSW",
              },
            },
            {
              id: 99,
              first_name: "Michael",
              last_name: "Jordan",
              draft_year: 2009,
              draft_round: 2,
              draft_number: 7,
              team: {
                id: 10,
                conference: "West",
                division: "Pacific",
                city: "Golden State",
                name: "Warriors",
                full_name: "Golden State Warriors",
                abbreviation: "GSW",
              },
            },
          ],
        },
        headers: {},
        config: {
          url: "https://api.balldontlie.io/v1/players",
          headers: {} as any,
        },
        status: 200,
        statusText: "OK",
      };
      const secondResponse = {
        ...firstResponse,
        data: {
          meta: {},
          data: [
            {
              id: 110,
              first_name: "Kobe",
              last_name: "Bryant",
              draft_year: 2009,
              draft_round: 1,
              draft_number: 7,
              team: {
                id: 10,
                conference: "West",
                division: "Pacific",
                city: "Golden State",
                name: "Warriors",
                full_name: "Golden State Warriors",
                abbreviation: "GSW",
              },
            },
            {
              id: 99,
              first_name: "Shaquille",
              last_name: "O'neill",
              draft_year: 2009,
              draft_round: null,
              draft_number: 7,
              team: {
                id: 10,
                conference: "West",
                division: "Pacific",
                city: "Golden State",
                name: "Warriors",
                full_name: "Golden State Warriors",
                abbreviation: "GSW",
              },
            },
          ],
        },
      };

      axiosInstance.get
        .mockResolvedValueOnce(teamsResponse)
        .mockResolvedValueOnce(firstResponse)
        .mockResolvedValueOnce(secondResponse);
      const results = await appService.getDraftRoundsFromTeamName(
        "Golden State Warriors"
      );
      expect(axiosInstance.get).toHaveBeenCalledTimes(3);
      expect(results).toEqual({
        one: 2,
        two: 1,
        none: 1,
      });
    });
  });
});
