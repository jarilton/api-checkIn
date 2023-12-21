import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { FastifyRequest, FastifyReply } from "fastify";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { RegisterUseCase } from "@/services/register";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    return reply.status(400).send();
  }

  return reply.status(201).send();
}
