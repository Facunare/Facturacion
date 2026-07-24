import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PROFESIONALES = ["Dra. Gómez", "Dr. Pérez", "Dra. Fernández", "Dr. Suárez"];
const PRESTACIONES = [
  "Consulta general",
  "Ecografía",
  "Análisis de sangre",
  "Radiografía",
  "Kinesiología",
  "Consulta cardiológica",
];
const OBRAS_SOCIALES = ["OSDE", "Swiss Medical", "IOMA", "PAMI", "Particular", "Galeno"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return past;
}

async function main() {
  console.log("Limpiando datos existentes...");
  await prisma.factura.deleteMany();
  await prisma.atencion.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("Creando usuarios...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const staffPassword = await bcrypt.hash("staff123", 10);

  await prisma.usuario.createMany({
    data: [
      { username: "admin", password: adminPassword, nombre: "Administrador General", role: "ADMINISTRADOR" },
      { username: "recepcion", password: staffPassword, nombre: "Personal Administrativo", role: "ADMINISTRATIVO" },
    ],
  });

  console.log("Creando clientes...");
  const nombres = ["Juan", "María", "Carlos", "Ana", "Luis", "Laura", "Pedro", "Sofía", "Diego", "Valentina", "Martín", "Camila"];
  const apellidos = ["González", "Rodríguez", "Fernández", "López", "Martínez", "García", "Sánchez", "Romero", "Torres", "Díaz"];

  const clientes = [];
  for (let i = 0; i < 40; i++) {
    const nombre = randomFrom(nombres);
    const apellido = randomFrom(apellidos);
    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        apellido,
        dni: (30000000 + i * 137).toString(),
        obraSocial: randomFrom(OBRAS_SOCIALES),
        telefono: `11-${4000 + i}-${5000 + i}`,
        email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}${i}@mail.com`,
        observaciones: null,
      },
    });
    clientes.push(cliente);
  }

  console.log("Creando atenciones y facturas...");
  for (let i = 0; i < 120; i++) {
    const cliente = randomFrom(clientes);
    const fecha = randomDate(120);
    const importe = Math.round((2000 + Math.random() * 18000) / 100) * 100;

    const atencion = await prisma.atencion.create({
      data: {
        clienteId: cliente.id,
        fecha,
        profesional: randomFrom(PROFESIONALES),
        prestacion: randomFrom(PRESTACIONES),
        importe,
      },
    });

    // ~60% ya facturadas, resto pendiente, un pequeño % cancelada
    const roll = Math.random();
    if (roll < 0.6) {
      await prisma.factura.create({
        data: {
          atencionId: atencion.id,
          estado: "FACTURADO",
          numeroFactura: `A-${String(1000 + i)}`,
          fechaFactura: new Date(fecha.getTime() + 1000 * 60 * 60 * 24 * 2),
          importeFacturado: importe,
        },
      });
    } else if (roll < 0.68) {
      await prisma.factura.create({
        data: {
          atencionId: atencion.id,
          estado: "CANCELADO",
        },
      });
    } else {
      await prisma.factura.create({
        data: {
          atencionId: atencion.id,
          estado: "PENDIENTE",
        },
      });
    }
  }

  console.log("Seed completo.");
  console.log("Usuarios de prueba:");
  console.log("  admin / admin123 (ADMINISTRADOR)");
  console.log("  recepcion / staff123 (ADMINISTRATIVO)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
