import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
const { lorem } = faker;

// min, max included
const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createPosts = (n) => {
  return Array.from(Array(n).keys()).map(() => ({
    title: lorem.sentence(getRandomInteger(3, 7)).replace(/\./g, ''), // 3-7 words
    content: lorem.paragraphs(getRandomInteger(1, 3)),
    published: true,
  }));
};

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const prisma = new PrismaClient();

const deleteAllTables = async () => {
  console.log('Deleting tables ...');
  await prisma.$transaction([
    // prisma.post.deleteMany(),
    // prisma.account.deleteMany(),
    // prisma.session.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log('Tables deleted.');
};

export const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    posts: {
      create: createPosts(1),
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    posts: {
      create: createPosts(1),
    },
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    posts: {
      create: createPosts(2),
    },
  },
];

export async function main() {
  await deleteAllTables();

  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });

    wait(300);
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
