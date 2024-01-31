import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript Academia",
        description: "A melhor academia do mundo",
        phone: "123456789",
        latitude: -27.210768,
        longitude: -49.644018,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Typescript Academia",
        description: "A melhor academia do mundo",
        phone: "123456789",
        latitude: -26.4836881,
        longitude: -52.5153616,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -27.210768,
        longitude: -49.644018,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(201);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Javascript Academia",
        }),
      ])
    );
  });
});
