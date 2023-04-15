const adapter = {
  ...PrismaAdapter(prisma),
  linkAccount: ({
    provider,
    type,
    providerAccountId,
    access_token,
    token_type,
    id_token,
    userId,
  }) =>
    prisma.account.create({
      data: {
        provider,
        type,
        providerAccountId,
        access_token,
        token_type,
        id_token,
        userId,
      },
    }),
};
