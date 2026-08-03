import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('artesanias.db');

export const initDatabase = () => {
  // Verificamos si existe la columna productos, si no, recreamos o agregamos de forma segura
  db.execSync(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clienteNombre TEXT NOT NULL,
      producto TEXT NOT NULL,
      productos TEXT,
      cantidad INTEGER NOT NULL,
      precio REAL NOT NULL,
      estado TEXT NOT NULL,
      fechaRegistro TEXT NOT NULL
    );
  `);

  try {
    db.execSync(`ALTER TABLE pedidos ADD COLUMN productos TEXT;`);
  } catch (e) {
    // Si ya existe la columna, no hace nada
  }

  db.execSync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);
};

export const registrarUsuarioDB = (nombre: string, email: string, pass: string) => {
  try {
    db.runSync(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?);',
      [nombre, email.toLowerCase().trim(), pass]
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: 'El correo electrónico ya está registrado.' };
  }
};

export const loginUsuarioDB = (email: string, pass: string) => {
  try {
    const usuario: any = db.getFirstSync(
      'SELECT * FROM usuarios WHERE email = ? AND password = ?;',
      [email.toLowerCase().trim(), pass]
    );
    if (usuario) {
      return { success: true, nombre: usuario.nombre };
    }
    return { success: false, error: 'Correo o contraseña incorrectos, o usuario no existe.' };
  } catch (error) {
    return { success: false, error: 'Error al verificar credenciales.' };
  }
};

// Pedidos
export const getPedidosDB = () => {
  const pedidos = db.getAllSync('SELECT * FROM pedidos ORDER BY id DESC;');
  return pedidos.map((p: any) => ({
    ...p,
    productos: p.productos ? JSON.parse(p.productos) : []
  }));
};

export const insertPedidoDB = (pedido: { clienteNombre: string; producto: string; productos: any; cantidad: number; precio: number; estado: string; fechaRegistro: string }) => {
  db.runSync(
    'INSERT INTO pedidos (clienteNombre, producto, productos, cantidad, precio, estado, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?, ?);',
    [
      pedido.clienteNombre, 
      pedido.producto, 
      JSON.stringify(pedido.productos || []), 
      pedido.cantidad, 
      pedido.precio, 
      pedido.estado, 
      pedido.fechaRegistro
    ]
  );
};

export const updatePedidoDB = (id: number, pedido: any) => {
  db.runSync(
    `UPDATE pedidos SET clienteNombre = ?, producto = ?, productos = ?, cantidad = ?, precio = ?, estado = ? WHERE id = ?;`,
    [
      pedido.clienteNombre,
      pedido.producto,
      JSON.stringify(pedido.productos || []),
      pedido.cantidad,
      pedido.precio,
      pedido.estado,
      id
    ]
  );
};

export const deletePedidoDB = (id: number) => {
  db.runSync('DELETE FROM pedidos WHERE id = ?;', [id]);
};