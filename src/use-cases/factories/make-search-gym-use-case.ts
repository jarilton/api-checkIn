import { SearchGymUseCase } from "../search-gym";
import { PrismaGymRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeSearchGymUseCase() {
  const gymsRepository = new PrismaGymRepository();
  const useCase = new SearchGymUseCase(gymsRepository);

  return useCase;
}
