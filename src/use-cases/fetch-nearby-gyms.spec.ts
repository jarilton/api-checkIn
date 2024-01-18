import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let fetchNearbyGymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch nearby gyms use case", () => {
  beforeEach(() => {
    fetchNearbyGymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(fetchNearbyGymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await fetchNearbyGymsRepository.create({
      title: "Near gym",
      description: null,
      phone: null,
      latitude: -27.210768,
      longitude: -49.644018,
    });

    await fetchNearbyGymsRepository.create({
      title: "Far gym",
      description: null,
      phone: null,
      latitude: -26.4836881,
      longitude: -52.5153616,
    });

    const { gyms } = await sut.execute({
      userLatitude: -27.210768,
      userLongitude: -49.644018,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms[0].title).toBe("Near gym");
  });
});
