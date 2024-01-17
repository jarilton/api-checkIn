import { UserAlreadyExists } from "./errors/user-already-exists";
import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface SearchGymUseCaseProps {
  query: string;
  page: number;
}

interface SearchGymUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymUseCaseProps): Promise<SearchGymUseCaseResponse> {
    const gymWithSameTitle = await this.gymsRepository.findById(query);

    if (gymWithSameTitle) {
      throw new UserAlreadyExists();
    }

    const gyms = await this.gymsRepository.searchMany(query, page);

    return {
      gyms,
    };
  }
}
