import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeSearchGymUseCase } from "@/use-cases/factories/make-search-gym-use-case";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    q: z.string(),
    page: z.number().int().positive().default(1),
  });

  const { q, page } = searchGymQuerySchema.parse(request.query);

  const searchGymUseCase = makeSearchGymUseCase();

  const { gyms } = await searchGymUseCase.execute({
    query: q,
    page,
  });

  return reply.status(201).send({
    gyms,
  });
}
