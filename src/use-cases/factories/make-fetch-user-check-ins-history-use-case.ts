import { PrismaCkeckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserCkeckInsHistoryUseCase } from "../fetch-user-check-ins-history";

export function makeFetchUserCheckInHistoryUseCase() {
  const checkInsRepository = new PrismaCkeckInsRepository();
  const useCase = new FetchUserCkeckInsHistoryUseCase(checkInsRepository);

  return useCase;
}
