import { InvalidCredentialsError } from './../../use-cases/errors/invalid-credentials-error';
import { AuthenticateUseCase } from './../../use-cases/authenticate';
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticaBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticaBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticaUseCase = new AuthenticateUseCase(usersRepository);

    await authenticaUseCase.execute({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(409).send({
        message: error.message,
      });
    }

    throw error;
  }

  return reply.status(200).send();
}
