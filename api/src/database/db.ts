import { PrismaClient, type User } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser(username: string, password: string): Promise<User> {
  const user = await prisma.user.create({
    data: {
      username,
      password,
    },
  });
  return user;
}

async function getUsers(): Promise<User[]> {
  const users = await prisma.user.findMany();
  return users;
}

async function getUserByUsername(username: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      username: username
    }
  })
  return user
}

export { createUser, getUserByUsername };
