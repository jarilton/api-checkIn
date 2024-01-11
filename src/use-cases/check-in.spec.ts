import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";

let checkInRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Check in use case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
    });

    console.log(checkIn.created_at);

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date("2024-01-10 10:00:00"));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
    });

    await expect(
      sut.execute({
        userId: "user-id",
        gymId: "gym-id",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different day", async () => {
    vi.setSystemTime(new Date("2024-01-11 10:00:00"));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
    });

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
