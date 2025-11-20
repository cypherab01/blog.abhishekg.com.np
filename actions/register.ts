"use server";

import { hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { TRegisterSchema } from "@/lib/schema/register";
import { RoleName } from "@prisma/client";

export async function registerServerAction(data: TRegisterSchema) {
  try {
    const { name, username, password: rawPassword } = data;

    const password = await hashPassword(rawPassword);

    // Find or create the READER role
    let role = await prisma.role.findFirst({
      where: { name: RoleName.BLOGGER },
    });

    if (!role) {
      role = await prisma.role.create({
        data: { name: RoleName.BLOGGER },
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return {
        status: false,
        message: "User with this username already exists",
      };
    }

    await prisma.user.create({
      data: {
        name,
        username,
        password,
        role: {
          connect: { id: role.id },
        },
      },
    });

    return {
      status: true,
      message: "User registered successfully",
    };
  } catch (error) {
    return {
      status: false,
      message: "Failed to register user",
    };
  }
}
