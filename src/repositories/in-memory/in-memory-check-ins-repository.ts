import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validade_at: data.validade_at ? new Date(data.validade_at) : null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }
}