import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('artesanias.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clienteNombre TEXT NOT NULL,
      producto TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      precio REAL NOT NULL,
      estado TEXT NOT NULL,
      fechaRegistro TEXT NOT NULL
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);
};

// Función para registrar usuario con su respectivo 'export'
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

// Función para iniciar sesión
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
  return db.getAllSync('SELECT * FROM pedidos ORDER BY id DESC;');
};

export const insertPedidoDB = (pedido: { clienteNombre: string; producto: string; cantidad: number; precio: number; estado: string; fechaRegistro: string }) => {
  db.runSync(
    'INSERT INTO pedidos (clienteNombre, producto, cantidad, precio, estado, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?);',
    [pedido.clienteNombre, pedido.producto, pedido.cantidad, pedido.precio, pedido.estado, pedido.fechaRegistro]
  );
};

export const deletePedidoDB = (id: number) => {
  db.runSync('DELETE FROM pedidos WHERE id = ?;', [id]);
};