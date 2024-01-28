import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymQuerySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const { latitude, longitude } = nearbyGymQuerySchema.parse(request.body);

  const nearbyGymUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await nearbyGymUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send({
    gyms,
  });
}
