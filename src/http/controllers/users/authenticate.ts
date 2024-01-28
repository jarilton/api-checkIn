import { InvalidCredentialsError } from "../../../use-cases/errors/invalid-credentials-error";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
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
    const authenticaUseCase = makeAuthenticateUseCase();

    const { user } = await authenticaUseCase.execute({
      email,
      password,
    });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      }
    );

    return reply.status(200).send({
      token,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(409).send({
        message: error.message,
      });
    }

    throw error;
  }
}
