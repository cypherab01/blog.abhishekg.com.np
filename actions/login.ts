"use server";

import { comparePassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { TLoginSchema } from "@/lib/schema/login";
import { RoleName } from "@prisma/client";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function loginServerAction(data: TLoginSchema) {
  try {
    const { username, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: { username },
      include: {
        role: true,
      },
    });

    if (!existingUser) {
      return {
        status: false,
        message: "User not found",
      };
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return {
        status: false,
        message: "Invalid password",
      };
    }

    // const token = await jwt.sign(
    //   { userId: existingUser.id, role: existingUser.role.name },
    //   process.env.JWT_SECRET!,
    //   { expiresIn: "7d" }
    // );

    // Create JWT with jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
      userId: existingUser.id,
      role: existingUser.role.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      status: true,
      message: "User logged in successfully",
      path: existingUser.role.name === RoleName.ADMIN ? "/admin" : "/dashboard",
    };
  } catch (error) {
    return {
      status: false,
      message: "Failed to login user",
    };
  }
}
