import { prisma } from "../lib/prisma";
import { RolUsuario } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import { createLogger } from "@/lib/logger";

const LOG_PREFIX = "SEED";

const logger = createLogger(LOG_PREFIX);

async function main() {
  logger.info("Iniciando seed...");
  try {
    await crearAdmin();
    await crearCategorias();
    logger.success(`¡Seed completado con éxito!`);
  } catch (e) {
    logger.error(`Error crítico durante el seed: ${e}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const crearAdmin = async () => {
  const correoAdmin = process.env.ADMIN_MAIL;
  const passwordAdmin = process.env.ADMIN_PASSWORD;

  if (!correoAdmin || !passwordAdmin) {
    logger.warn(`No se encontraron ADMIN_MAIL o ADMIN_PASSWORD. Se saltará la creación del admin.`,);
    return;
  }

    const hashedPassword = await bcrypt.hash(passwordAdmin, 10);

    const admin = await prisma.usuario.upsert({
      where: { email: correoAdmin },
      update: {}, // No actualizamos nada si ya existe
      create: {
        nombre: "Administrador Principal",
        email: correoAdmin,
        password: hashedPassword,
        rol: RolUsuario.ADMIN, 
      },
    });

    logger.success(`Usuario administrador asegurado: ${admin.email}`);

};

const crearCategorias = async () => {
  const categoriasBase = [
    { nombre: "Bolis de agua" },
    { nombre: "Bolis de leche" },
    { nombre: "Pulpas de fruta" },
    { nombre: "Concentrados" },
  ];

    const resultado = await prisma.categoria.createMany({
      data: categoriasBase,
      skipDuplicates: true, 
    });

    if (resultado.count > 0) {
      logger.success(`Se insertaron ${resultado.count} categorías nuevas.`);
    } else {
      logger.info(`Las categorías ya estaban creadas.`);
    }
};

main();