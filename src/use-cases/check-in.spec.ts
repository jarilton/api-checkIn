import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CheckInUseCase } from "./check-in";
import { Decimal } from "@prisma/client/runtime/library";

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check in use case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    gymsRepository.items.push({
      id: "gym-id",
      title: "Gym Javascript  ",
      description: "The best gym to learn Javascript",
      phone: "123456789",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    console.log(checkIn.created_at);

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date("2024-01-10 10:00:00"));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(
      sut.execute({
        userId: "user-id",
        gymId: "gym-id",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different day", async () => {
    vi.setSystemTime(new Date("2022, 0, 20, 8, 0, 0"));

    await sut.execute({
      gymId: "gym-id",
      userId: "user-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date("2022, 0, 21, 8, 0, 0"));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
