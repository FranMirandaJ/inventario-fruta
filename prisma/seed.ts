import { prisma } from "../lib/prisma";
import { Prisma, RolUsuario, TipoMovimiento } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import { createLogger } from "@/lib/logger";

const LOG_PREFIX = "SEED";

const logger = createLogger(LOG_PREFIX);

async function main() {
  logger.info("Iniciando seed...");
  try {
    await crearAdmin();
    await crearVendedor();
    await crearCategorias();
    await crearProductos();
    await crearVentas();
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

const crearVendedor = async () => {
  const passwordAdmin = process.env.ADMIN_PASSWORD;

  if (!passwordAdmin) {
    logger.warn("No se encontró ADMIN_PASSWORD. Se saltará la creación del vendedor.");
    return;
  }

  const hashedPassword = await bcrypt.hash(passwordAdmin, 10);

  const vendedor = await prisma.usuario.upsert({
    where: { email: "veronica@gmail.com" },
    update: {},
    create: {
      nombre: "Verónica Jaramillo",
      email: "veronica@gmail.com",
      password: hashedPassword,
      rol: RolUsuario.VENDEDOR,
    },
  });

  logger.success(`Vendedor asegurado: ${vendedor.email}`);
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

const crearProductos = async () => {
  const categorias = await prisma.categoria.findMany();
  const admin = await prisma.usuario.findFirst({
    where: { rol: RolUsuario.ADMIN },
  });

  if (!admin) {
    logger.warn("No se encontró un administrador. Saltando creación de productos.");
    return;
  }

  const productosData = [
    { nombre: "Bolis de guayaba",           categoria: "Bolis de agua",   precio: 10, stock_actual: 50, stock_minimo: 20, activo: true },
    { nombre: "Bolis de limón",             categoria: "Bolis de agua",   precio: 10, stock_actual: 40, stock_minimo: 20, activo: true },
    { nombre: "Bolis de rompope",           categoria: "Bolis de leche",  precio: 15, stock_actual: 35, stock_minimo: 15, activo: true },
    { nombre: "Bolis de galleta oreo",      categoria: "Bolis de leche",  precio: 15, stock_actual: 30, stock_minimo: 15, activo: true },
    { nombre: "Pulpa de mango",             categoria: "Pulpas de fruta", precio: 30, stock_actual: 25, stock_minimo: 10, activo: true },
    { nombre: "Pulpa de ciruela",           categoria: "Pulpas de fruta", precio: 30, stock_actual: 20, stock_minimo: 10, activo: true },
    { nombre: "Concentrado de jamaica 1L",  categoria: "Concentrados",    precio: 15, stock_actual: 15, stock_minimo: 5,  activo: false },
  ];

  let creados = 0;
  let omitidos = 0;

  for (const p of productosData) {
    const cat = categorias.find((c) => c.nombre === p.categoria);
    if (!cat) {
      logger.warn(`Categoría "${p.categoria}" no encontrada. Saltando "${p.nombre}".`);
      continue;
    }

    const existe = await prisma.producto.findFirst({
      where: { nombre: p.nombre, categoria_id: cat.id },
    });

    if (existe) {
      logger.info(`Producto "${p.nombre}" ya existe. Saltando.`);
      omitidos++;
      continue;
    }

    await prisma.producto.create({
      data: {
        nombre: p.nombre,
        precio: p.precio,
        categoria_id: cat.id,
        stock_actual: p.stock_actual,
        stock_minimo: p.stock_minimo,
        activo: p.activo,
        movimientos: {
          create: {
            usuario_id: admin.id,
            tipo: TipoMovimiento.ENTRADA,
            cantidad: p.stock_actual,
            motivo: "Stock inicial",
          },
        },
      },
    });

    creados++;
  }

  if (creados > 0) logger.success(`Se crearon ${creados} productos.`);
  if (omitidos > 0) logger.info(`${omitidos} productos ya existían y se omitieron.`);
};

const crearVentas = async () => {
  const admin = await prisma.usuario.findFirst({ where: { rol: RolUsuario.ADMIN } });
  if (!admin) {
    logger.warn("No se encontró un administrador. Saltando creación de ventas.");
    return;
  }

  const yaHayVentas = await prisma.venta.findFirst();
  if (yaHayVentas) {
    logger.info("Ya existen ventas registradas. Saltando.");
    return;
  }

  const productos = await prisma.producto.findMany({ where: { activo: true } });
  if (productos.length < 2) {
    logger.warn("Se necesitan al menos 2 productos activos. Saltando.");
    return;
  }

  const guayaba = productos.find((p) => p.nombre.includes("guayaba"));
  const rompope = productos.find((p) => p.nombre.includes("rompope"));
  const mango   = productos.find((p) => p.nombre.includes("mango"));

  if (!guayaba || !rompope || !mango) {
    logger.warn("No se encontraron los productos esperados. Saltando.");
    return;
  }

  const ventasData = [
    {
      items: [
        { producto: guayaba, cantidad: 4 },
      ],
    },
    {
      items: [
        { producto: rompope, cantidad: 3 },
        { producto: mango,   cantidad: 2 },
      ],
    },
  ];

  for (const ventaData of ventasData) {
    const total = ventaData.items.reduce(
      (sum, { producto, cantidad }) => sum + Number(producto.precio) * cantidad,
      0,
    );

    await prisma.$transaction(async (tx) => {
      await tx.venta.create({
        data: {
          total: new Prisma.Decimal(total),
          usuario_id: admin.id,
          detalles: {
            create: ventaData.items.map(({ producto, cantidad }) => ({
              producto_id: producto.id,
              cantidad,
              precio_unitario: producto.precio,
              subtotal: new Prisma.Decimal(Number(producto.precio) * cantidad),
            })),
          },
          movimientoInventarios: {
            create: ventaData.items.map(({ producto, cantidad }) => ({
              producto_id: producto.id,
              usuario_id: admin.id,
              tipo: TipoMovimiento.SALIDA,
              cantidad,
              motivo: "Venta registrada",
            })),
          },
        },
      });

      for (const { producto, cantidad } of ventaData.items) {
        await tx.producto.update({
          where: { id: producto.id },
          data: { stock_actual: { decrement: cantidad } },
        });
      }
    });
  }

  logger.success(`Se crearon ${ventasData.length} ventas de prueba.`);
};

main();