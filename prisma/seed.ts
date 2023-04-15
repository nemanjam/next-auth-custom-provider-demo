import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
const { lorem } = faker;

const prisma = new PrismaClient();

// min, max included
export const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createPosts = (n) => {
  return Array.from(Array(n).keys()).map(() => ({
    title: lorem.sentence(getRandomInteger(3, 7)).replace(/\./g, ''), // 3-7 words
    content: lorem.sentence(getRandomInteger(10, 20)),
    published: true,
  }));
};

const createUsers = () => [
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

export class SeedSingleton {
  isInternalClient: boolean;
  prisma: PrismaClient;
  private static instance: SeedSingleton;

  constructor(prisma, isInternalClient) {
    this.isInternalClient = isInternalClient;
    this.prisma = prisma;

    SeedSingleton.instance = this;
  }

  static getInstance(prisma = null) {
    if (!SeedSingleton.instance) {
      const isInternalClient = !prisma;
      const prismaClient = isInternalClient ? new PrismaClient() : prisma;

      SeedSingleton.instance = new SeedSingleton(prismaClient, isInternalClient);
    }
    return SeedSingleton.instance;
  }

  async handledDeleteAllTables() {
    try {
      await this.deleteAllTables();
    } catch (error) {
      console.error('Handled delete tables error:', error);
    }
  }

  async handledSeed() {
    try {
      await this.seed();
    } catch (error) {
      console.error('Handled seed error:', error);
    }
  }

  async deleteAllTables() {
    console.log('Deleting tables ...');
    await this.prisma.$transaction([
      this.prisma.post.deleteMany(),
      this.prisma.account.deleteMany(),
      this.prisma.session.deleteMany(),
      this.prisma.verificationToken.deleteMany(),
      this.prisma.user.deleteMany(),
    ]);
    console.log('Tables deleted.');
  }

  async seed() {
    console.log('Start seeding ...');
    await this.deleteAllTables();

    const users = createUsers();

    for (const data of users) {
      const user = await this.prisma.user.create({ data });
      console.log(`Created user with email: ${user.email}`);
    }
    console.log('Seeding finished.');
  }

  /**
   * error handling only here
   */
  async run() {
    try {
      await this.seed();
    } catch (error) {
      console.error('Seeding error:', error);
      if (this.isInternalClient) {
        process.exit(1);
      }
    } finally {
      if (this.isInternalClient) {
        await this.prisma.$disconnect();
      }
    }
  }
}
