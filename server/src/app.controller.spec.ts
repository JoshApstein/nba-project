import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let app: TestingModule;
  const mockTeam = { name: "Los Angeles Lakers", id: 1 };
  const mockDraftPicks = {
    one: 5,
    two: 10,
    none: 15,
  };

  beforeEach(async () => {
    app = await Test.createTestingModule({
      providers: [
        {
          provide: AppService,
          useValue: {
            getTeams: jest.fn().mockResolvedValue([mockTeam]),
            getDraftRoundsForTeam: jest.fn().mockResolvedValue(mockDraftPicks),
          },
        },
      ],
      controllers: [AppController],
    }).compile();
  });

  describe("getTeams", () => {
    it("should return all team names and ids", async () => {
      const appController = app.get(AppController);
      expect(await appController.getTeams()).toEqual([mockTeam]);
    });
  });

  describe("getDraftPicks", () => {
    it("should return one, two, and none draft picks for the given team", async () => {
      const appController = app.get(AppController);
      expect(await appController.getTeamDraftPicksFromId("1")).toEqual(
        mockDraftPicks
      );
    });
  });
});
