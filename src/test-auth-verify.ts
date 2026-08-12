import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

async function testAuth() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { email: 'admin@sih.gov.in' },
    include: { role: true },
  });

  if (!user) {
    console.error('VERIFY_FAIL: Admin user not found');
    process.exit(1);
  }

  const isMatch = await bcrypt.compare('Password123!', user.password);
  if (isMatch) {
    console.log('VERIFY_SUCCESS: Auth system verified! User:', user.name, 'Role:', user.role.name);
  } else {
    console.error('VERIFY_FAIL: Password mismatch');
    process.exit(1);
  }

  await prisma.$disconnect();
}

testAuth();
