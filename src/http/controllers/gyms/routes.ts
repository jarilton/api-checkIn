import { FastifyInstance } from "fastify";

import { verifyJwt } from "../../middlewares/verify-jwt";
import { search } from "./search";
import { nearby } from "./nearby";
import { create } from "./create";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwt);

  app.get("/gyms/nearby", nearby);
  app.get("/gyms/search", search);

  app.post("/gyms", create);
}
