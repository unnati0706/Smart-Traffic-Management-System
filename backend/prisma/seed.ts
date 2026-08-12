import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });

  const authorityRole = await prisma.role.upsert({
    where: { name: 'TRAFFIC_AUTHORITY' },
    update: {},
    create: { name: 'TRAFFIC_AUTHORITY' },
  });

  const citizenRole = await prisma.role.upsert({
    where: { name: 'CITIZEN' },
    update: {},
    create: { name: 'CITIZEN' },
  });

  // 2. Permissions (§6)
  const permissionsList = [
    'traffic.view',
    'incident.view',
    'incident.create',
    'incident.update',
    'signal.view',
    'signal.recommend',
    'signal.approve',
    'simulation.create',
    'emergency.view',
    'emergency.manage',
    'analytics.view',
    'reports.create',
    'users.manage',
    'settings.manage',
    'audit.view',
  ];

  for (const permName of permissionsList) {
    const perm = await prisma.permission.upsert({
      where: { name: permName },
      update: {},
      create: { name: permName },
    });

    // Assign all permissions to ADMIN
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });

    // Assign operational permissions to TRAFFIC_AUTHORITY
    if (
      permName.startsWith('traffic.') ||
      permName.startsWith('incident.') ||
      permName.startsWith('signal.') ||
      permName.startsWith('simulation.') ||
      permName.startsWith('emergency.') ||
      permName.startsWith('analytics.') ||
      permName.startsWith('reports.')
    ) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: authorityRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: authorityRole.id,
          permissionId: perm.id,
        },
      });
    }

    // Assign view & incident create permissions to CITIZEN
    if (
      permName === 'traffic.view' ||
      permName === 'incident.view' ||
      permName === 'incident.create'
    ) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: citizenRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: citizenRole.id,
          permissionId: perm.id,
        },
      });
    }
  }

  // 3. Seed Users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sih.gov.in' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@sih.gov.in',
      password: passwordHash,
      roleId: adminRole.id,
      status: 'ACTIVE',
    },
  });

  const authorityUser = await prisma.user.upsert({
    where: { email: 'authority@sih.gov.in' },
    update: {},
    create: {
      name: 'Traffic Officer',
      email: 'authority@sih.gov.in',
      password: passwordHash,
      roleId: authorityRole.id,
      status: 'ACTIVE',
    },
  });

  const citizenUser = await prisma.user.upsert({
    where: { email: 'citizen@sih.gov.in' },
    update: {},
    create: {
      name: 'Citizen User',
      email: 'citizen@sih.gov.in',
      password: passwordHash,
      roleId: citizenRole.id,
      status: 'ACTIVE',
    },
  });

  console.log('Seeding complete successfully.');
  console.log('Seeded Users:');
  console.log(` - Admin: ${adminUser.email} (Password: Password123!)`);
  console.log(` - Traffic Officer: ${authorityUser.email} (Password: Password123!)`);
  console.log(` - Citizen: ${citizenUser.email} (Password: Password123!)`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
