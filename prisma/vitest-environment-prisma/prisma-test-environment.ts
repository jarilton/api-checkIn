import { Environment } from "vitest";

export default <Environment>{
  name: "prisma",
  transformMode: "web",
  async setup() {
    console.log("prisma setup");

    return {
      teardown() {
        console.log("prisma teardown");
      },
    };
  },
};
