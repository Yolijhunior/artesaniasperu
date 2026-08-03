export const validarCorreo = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarNombre = (nombre: string): { esValido: boolean; mensaje: string } => {
  const limpio = nombre.trim();
  
  if (!limpio) {
    return { esValido: false, mensaje: 'El nombre completo es obligatorio.' };
  }
  
  if (limpio.length < 3) {
    return { esValido: false, mensaje: 'El nombre es demasiado corto.' };
  }
  
  const soloLetrasYEspacios = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(limpio);
  if (!soloLetrasYEspacios) {
    return { esValido: false, mensaje: 'El nombre no debe contener números ni caracteres especiales.' };
  }
  
  const primerCaracter = limpio[0].toLowerCase();
  const esMonotono = limpio.toLowerCase().split('').every(c => c === primerCaracter || c === ' ');
  if (esMonotono) {
    return { esValido: false, mensaje: 'Por favor ingrese un nombre real (no caracteres repetidos).' };
  }

  return { esValido: true, mensaje: '' };
};

export const validarPassword = (password: string): { esValido: boolean; mensaje: string } => {
  if (!password || password.length < 6) {
    return { esValido: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' };
  }
  return { esValido: true, mensaje: '' };
};

export const validarPedidoForm = (datos: {
  clienteNombre: string;
  producto: string;
  cantidad: string;
  precio: string;
}): { esValido: boolean; errores: { [key: string]: string } } => {
  const errores: { [key: string]: string } = {};
  
  const valNombre = validarNombre(datos.clienteNombre);
  if (!valNombre.esValido) {
    errores.clienteNombre = valNombre.mensaje;
  }
  
  if (!datos.producto || datos.producto.trim() === '') {
    errores.producto = 'Debe seleccionar un producto artesanal del catálogo.';
  }
  
  if (!datos.cantidad || datos.cantidad.trim() === '') {
    errores.cantidad = 'La cantidad es obligatoria.';
  } else if (!/^[0-9]+$/.test(datos.cantidad.trim()) || Number(datos.cantidad) <= 0) {
    errores.cantidad = 'Ingrese una cantidad numérica válida (mayor a 0).';
  }
  
  if (!datos.precio || datos.precio.trim() === '') {
    errores.precio = 'El precio es obligatorio.';
  } else if (isNaN(Number(datos.precio)) || Number(datos.precio) <= 0) {
    errores.precio = 'El precio debe ser un valor numérico válido.';
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores,
  };
};