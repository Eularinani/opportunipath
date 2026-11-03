import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generatePassword(length = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function main() {
  // Admin user — password aleatória gerada em cada seed
  const plainPassword = generatePassword(14);
  const adminPassword = await bcrypt.hash(plainPassword, 12);
  await prisma.user.upsert({
    where: { email: 'admin@opportunipath.ao' },
    update: {},
    create: {
      name: 'Admin OportuniPath',
      email: 'admin@opportunipath.ao',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('🔑 Admin criado/atualizado: admin@opportunipath.ao / ' + plainPassword);
  console.log('   Guarda esta password — não será mostrada novamente.');

  // Não são criadas bolsas nem subscritores de exemplo: tudo o que aparece no site
  // tem de ser real. As bolsas entram pelo admin ou pelo importador (como rascunho).
  console.log('✅ Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
