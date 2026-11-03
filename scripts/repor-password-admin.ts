import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

// Uso: npm run admin:password -- [email]
// Gera uma password aleatória nova para um admin existente e mostra-a uma única vez.
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] ?? 'admin@opportunipath.ao';
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== 'ADMIN') {
    console.error(`❌ Não existe nenhum admin com o email ${email}.`);
    process.exit(1);
  }

  const password = randomBytes(12).toString('base64url');
  await prisma.user.update({ where: { email }, data: { password: await bcrypt.hash(password, 12) } });

  console.log(`🔑 Nova password para ${email}: ${password}`);
  console.log('   Guarda-a agora — não será mostrada novamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
