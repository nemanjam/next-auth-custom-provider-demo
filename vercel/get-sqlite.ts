import download from 'download';
import tempy from 'tempy';
import path from 'path';

export const getSqlite = async () => {
  const tempDir = tempy.temporaryDirectory();
  await download(
    'https://github.com/vkostunica/next-auth-custom-provider-demo/raw/main/prisma/dev.db',
    tempDir
  );
  return path.join(tempDir, 'dev.db');
};
