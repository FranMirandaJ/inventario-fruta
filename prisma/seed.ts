import { PrismaClient, RolUsuario } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const LOG_PREFIX = "[SEED]";

async function main() {
  try {
    await crearAdmin();
    await crearCategorias();
    console.log(`${LOG_PREFIX} - ¡Seed completado con éxito! 🎉`);
  } catch (e) {
    console.error(`${LOG_PREFIX} - Error crítico durante el seed:`, e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const crearAdmin = async () => {
  const correoAdmin = process.env.ADMIN_MAIL;
  const passwordAdmin = process.env.ADMIN_PASSWORD;

  if (!correoAdmin || !passwordAdmin) {
    console.warn(
      `${LOG_PREFIX} - ⚠️ No se encontraron ADMIN_MAIL o ADMIN_PASSWORD. Se saltará la creación del admin.`,
    );
    return;
  }

  try {
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

    console.log(`${LOG_PREFIX} - ✅ Usuario administrador asegurado: ${admin.email}`);
  } catch (error) {
    console.error(`${LOG_PREFIX} - ❌ Error al hacer upsert del admin:`, error);
    throw error; 
  }
};

const crearCategorias = async () => {
  const categoriasBase = [
    { nombre: "Bolis de agua" },
    { nombre: "Bolis de leche" },
    { nombre: "Pulpas de fruta" },
    { nombre: "Concentrados" },
  ];

  try {
    const resultado = await prisma.categoria.createMany({
      data: categoriasBase,
      skipDuplicates: true, 
    });

    if (resultado.count > 0) {
      console.log(`${LOG_PREFIX} - ✅ Se insertaron ${resultado.count} categorías nuevas.`);
    } else {
      console.log(`${LOG_PREFIX} - ℹ️ Las categorías ya estaban creadas.`);
    }
  } catch (error) {
    console.error(`${LOG_PREFIX} - ❌ Error al crear las categorías:`, error);
    throw error;
  }
};

main();