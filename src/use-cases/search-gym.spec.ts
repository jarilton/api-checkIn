import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { SearchGymUseCase } from "./search-gym";

let searchGymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Search gyms use case", () => {
  beforeEach(() => {
    searchGymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(searchGymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await searchGymsRepository.create({
      title: "Academia 1",
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });

    await searchGymsRepository.create({
      title: "Academia 2",
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await sut.execute({
      query: "Academia 1",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "Academia 1",
      }),
    ]);
  });
});

it("should be able to fetch paginated search gyms", async () => {
  for (let i = 0; i < 22; i++) {
    await searchGymsRepository.create({
      title: `Academia ${i}`,
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });
  }

  const { gyms: firstPage } = await sut.execute({
    query: "Academia",
    page: 1,
  });

  const { gyms: secondPage } = await sut.execute({
    query: "Academia",
    page: 2,
  });

  expect(firstPage).toHaveLength(20);
  expect(secondPage).toHaveLength(4);
});
