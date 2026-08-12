import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding complete SIH demo data (§28)...');

  // 1. Roles & Permissions (§6)
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

    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });

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
        where: { roleId_permissionId: { roleId: authorityRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: authorityRole.id, permissionId: perm.id },
      });
    }

    if (permName === 'traffic.view' || permName === 'incident.view' || permName === 'incident.create') {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: citizenRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: citizenRole.id, permissionId: perm.id },
      });
    }
  }

  // 2. Users
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

  await prisma.user.upsert({
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

  // 3. 10+ Roads (§28)
  const roadData = [
    { code: 'RD_01', name: 'MG Road', geometry: '[[28.61,77.20],[28.62,77.21]]', laneCount: 6, capacity: 3600 },
    { code: 'RD_02', name: 'Outer Ring Road', geometry: '[[28.62,77.21],[28.63,77.22]]', laneCount: 8, capacity: 4800 },
    { code: 'RD_03', name: 'Vikas Marg', geometry: '[[28.63,77.22],[28.64,77.23]]', laneCount: 4, capacity: 2400 },
    { code: 'RD_04', name: 'Grand Trunk Road', geometry: '[[28.64,77.23],[28.65,77.24]]', laneCount: 6, capacity: 3600 },
    { code: 'RD_05', name: 'Janpath', geometry: '[[28.61,77.21],[28.62,77.22]]', laneCount: 4, capacity: 2400 },
    { code: 'RD_06', name: 'Rajpath Expressway', geometry: '[[28.60,77.20],[28.61,77.22]]', laneCount: 8, capacity: 4800 },
    { code: 'RD_07', name: 'Airport Bypass Road', geometry: '[[28.58,77.15],[28.60,77.18]]', laneCount: 6, capacity: 3600 },
    { code: 'RD_08', name: 'IT Corridor Link Road', geometry: '[[28.55,77.25],[28.58,77.28]]', laneCount: 6, capacity: 3600 },
    { code: 'RD_09', name: 'Connaught Circus Outer', geometry: '[[28.63,77.21],[28.63,77.22]]', laneCount: 6, capacity: 3200 },
    { code: 'RD_10', name: 'Yamuna Bank Expressway', geometry: '[[28.64,77.26],[28.68,77.30]]', laneCount: 8, capacity: 5000 },
  ];

  const createdRoads = [];
  for (const r of roadData) {
    const road = await prisma.road.upsert({
      where: { code: r.code },
      update: {},
      create: r,
    });
    createdRoads.push(road);
  }

  // 4. 8 Intersections (§28)
  const intersectionData = [
    { name: 'Central Chowk', latitude: 28.6139, longitude: 77.209, roadId: createdRoads[0].id },
    { name: 'Ring Road Junction', latitude: 28.625, longitude: 77.218, roadId: createdRoads[1].id },
    { name: 'Vikas Marg Crossing', latitude: 28.632, longitude: 77.225, roadId: createdRoads[2].id },
    { name: 'GT Road Terminal', latitude: 28.641, longitude: 77.234, roadId: createdRoads[3].id },
    { name: 'Janpath Gate', latitude: 28.618, longitude: 77.214, roadId: createdRoads[4].id },
    { name: 'Rajpath Flyover Link', latitude: 28.608, longitude: 77.212, roadId: createdRoads[5].id },
    { name: 'Airport Expressway Split', latitude: 28.59, longitude: 77.17, roadId: createdRoads[6].id },
    { name: 'IT Hub Circle', latitude: 28.56, longitude: 77.26, roadId: createdRoads[7].id },
  ];

  const createdIntersections = [];
  for (const i of intersectionData) {
    let intersection = await prisma.intersection.findFirst({ where: { name: i.name } });
    if (!intersection) {
      intersection = await prisma.intersection.create({ data: i });
    }
    createdIntersections.push(intersection);
  }

  // 5. Signals & Phases
  for (const [idx, intersection] of createdIntersections.entries()) {
    let signal = await prisma.signal.findFirst({ where: { intersectionId: intersection.id } });
    if (!signal) {
      signal = await prisma.signal.create({
        data: {
          intersectionId: intersection.id,
          controllerName: `SCATS_${idx + 101}`,
          currentPhase: 1,
          cycleLength: 120,
          status: 'OPERATIONAL',
          phases: {
            create: [
              { phaseNumber: 1, movement: 'NORTH_SOUTH_STRAIGHT', minGreen: 15, maxGreen: 60, yellowDuration: 5, currentGreen: 35 },
              { phaseNumber: 2, movement: 'EAST_WEST_STRAIGHT', minGreen: 15, maxGreen: 60, yellowDuration: 5, currentGreen: 30 },
              { phaseNumber: 3, movement: 'NORTH_SOUTH_LEFT', minGreen: 10, maxGreen: 30, yellowDuration: 3, currentGreen: 15 },
              { phaseNumber: 4, movement: 'EAST_WEST_LEFT', minGreen: 10, maxGreen: 30, yellowDuration: 3, currentGreen: 15 },
            ],
          },
        },
      });
    }

    // Traffic Observations over multiple time periods
    await prisma.trafficObservation.create({
      data: {
        intersectionId: intersection.id,
        source: 'SIMULATED',
        vehicleCount: Math.floor(Math.random() * 80) + 20,
        averageSpeed: Math.floor(Math.random() * 30) + 15,
        density: Math.round((Math.random() * 0.5 + 0.3) * 100) / 100,
        queueLength: Math.floor(Math.random() * 25) + 5,
        laneOccupancy: Math.round((Math.random() * 0.4 + 0.2) * 100) / 100,
      },
    });
  }

  // 6. Active Incidents (§28)
  const incident1 = await prisma.incident.create({
    data: {
      type: 'ACCIDENT',
      intersectionId: createdIntersections[0].id,
      latitude: createdIntersections[0].latitude,
      longitude: createdIntersections[0].longitude,
      severity: 'HIGH',
      source: 'AUTHORITY',
      description: 'Multi-vehicle collision blocking two inner lanes at Central Chowk',
      status: 'IN_PROGRESS',
    },
  });

  // 7. Emergency Vehicles (§28: 1 Ambulance, 1 Fire Truck)
  const amb = await prisma.emergencyVehicle.upsert({
    where: { identifier: 'AMB_108_DELHI' },
    update: {},
    create: {
      type: 'AMBULANCE',
      identifier: 'AMB_108_DELHI',
      latitude: 28.605,
      longitude: 77.2,
      destinationLatitude: 28.635,
      destinationLongitude: 77.24,
      status: 'DISPATCHED',
    },
  });

  const fire = await prisma.emergencyVehicle.upsert({
    where: { identifier: 'FIRE_TENDER_04' },
    update: {},
    create: {
      type: 'FIRE_TRUCK',
      identifier: 'FIRE_TENDER_04',
      latitude: 28.58,
      longitude: 77.16,
      destinationLatitude: 28.62,
      destinationLongitude: 77.21,
      status: 'IDLE',
    },
  });

  // 8. Predictions, Signal Recommendations & Simulation Examples
  const pred = await prisma.prediction.create({
    data: {
      intersectionId: createdIntersections[0].id,
      horizonMinutes: 30,
      predictedDensity: 0.82,
      predictedQueue: 24.5,
      congestionProbability: 0.89,
      confidence: 0.86,
      factorsJson: JSON.stringify(['Peak rush hour window', 'Active incident blocking lanes']),
    },
  });

  await prisma.signalRecommendation.create({
    data: {
      intersectionId: createdIntersections[0].id,
      predictionId: pred.id,
      currentPlanJson: JSON.stringify([{ phase: 1, duration: 30 }, { phase: 2, duration: 30 }]),
      recommendedPlanJson: JSON.stringify([{ phase: 1, duration: 55 }, { phase: 2, duration: 20 }]),
      reason: 'Extend North-South green phase duration to clear incident queue spillback',
      confidence: 0.91,
      status: 'PENDING',
      createdBy: authorityUser.id,
    },
  });

  await prisma.simulationRun.create({
    data: {
      scenario: 'ACCIDENT',
      intersectionId: createdIntersections[0].id,
      parametersJson: JSON.stringify({ laneClosureCount: 2, durationMinutes: 45 }),
      status: 'COMPLETED',
      completedAt: new Date(),
      results: {
        create: [
          { metric: 'Average Waiting Time', beforeValue: 54.2, afterValue: 32.0, unit: 'seconds' },
          { metric: 'Max Queue Length', beforeValue: 38.0, afterValue: 18.5, unit: 'meters' },
        ],
      },
    },
  });

  // 9. Government Data Sources (§21)
  await prisma.dataSource.createMany({
    data: [
      {
        name: 'Delhi Traffic Police Sensor Feed',
        organization: 'Delhi Traffic Police',
        sourceUrl: 'https://traffic.delhipolice.gov.in/api/v1/sensors',
        type: 'REALTIME_SENSOR',
        verificationStatus: 'VERIFIED',
      },
      {
        name: 'ISRO BHUVAN Urban Mobility Portal',
        organization: 'ISRO',
        sourceUrl: 'https://bhuvan.nrsc.gov.in/traffic',
        type: 'GIS_SPATIAL',
        verificationStatus: 'VERIFIED',
      },
    ],
  });

  console.log('Seeding complete! 8 Intersections, 10 Roads, Signals, Emergency Vehicles, Predictions, Data Sources successfully populated.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
