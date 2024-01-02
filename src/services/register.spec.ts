import { User } from '@prisma/client';
import { RegisterUseCase } from '@/services/register';
import { expect, describe, it } from "vitest";
import { compare } from 'bcryptjs';

describe("register use case", () => {
  it("should hash user password upon registration", async () => {
    
    const registerUseCase = new RegisterUseCase({
      async findByEmail(email) {
        return null;
      },

      async create(data: any) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password: data.password,
          created_at: new Date(),
          updated_at: new Date(),
        }
      },
    });

    const {user} = await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });


    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password
    );
    
  
    expect(isPasswordCorrectlyHashed).toBe(true);

  });
});