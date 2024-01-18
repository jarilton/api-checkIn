import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CheckInUseCase } from "./check-in";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check in use case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);

    // vi.useFakeTimers();
  });

  //   afterEach(() => {
  //     vi.useRealTimers();
  //   });

  it("should be able to validate the check-in", async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
      validade_at: null,
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validade_at).toEqual(expect.any(Date));
    expect(checkInRepository.items[0].validade_at).toEqual(expect.any(Date));
  });

  it("should not be able to validate an inexistent check-in", async () => {
    await expect(
      sut.execute({
        checkInId: "inexistent-check-in-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
