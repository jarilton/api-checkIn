import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCkeckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInRepository: InMemoryCheckInsRepository;
let sut: FetchUserCkeckInsHistoryUseCase;

describe("Fetch user check ins history use case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCkeckInsHistoryUseCase(checkInRepository);
  });

  it("should be able to fetch check in history", async () => {
    await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: "gym-01",
      }),
      expect.objectContaining({
        gym_id: "gym-02",
      }),
    ]);
  });

  it("should be able to fetch paginated check in history", async () => {
    for (let i = 0; i < 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
      });
    }

    const { checkIns: firstPage } = await sut.execute({
      userId: "user-01",
      page: 1,
    });

    const { checkIns: secondPage } = await sut.execute({
      userId: "user-01",
      page: 2,
    });

    expect(firstPage).toHaveLength(20);
    expect(secondPage).toHaveLength(2);
  });
});
