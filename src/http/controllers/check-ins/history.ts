import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFetchUserCheckInHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.number().int().positive().default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const searchGymUseCase = makeFetchUserCheckInHistoryUseCase();

  const { checkIns } = await searchGymUseCase.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(201).send({
    checkIns,
  });
}
