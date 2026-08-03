# 📱 PedidosApp - Sistema de Gestión de Pedidos y Catálogo

<div align="center">

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-07405e?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)

</div>

---

## 1. Descripción del Proyecto
**PedidosApp** es una aplicación móvil desarrollada con tecnologías multiplataforma para el control y la gestión integral de pedidos comerciales. Permite la persistencia de datos de forma local, el consumo asíncrono de APIs REST para catálogos de productos y una interfaz intuitiva con pantallas dedicadas para el ciclo de vida completo de cada orden.

---

##  2. Integrantes del Equipo
* **Desarrolladores / Colaboradores:** Yoli Jhunior *(Yolijhunior)*

---

##  3. Requisitos del Entorno
* ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white) **Node.js** (Versión LTS recomendada 18.x o superior).
* ![npm](https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white) **npm** o **Yarn** para la gestión de dependencias.
* **Expo CLI** (Herramienta CLI para la ejecución del entorno).
* **Expo Go** instalado en un dispositivo físico (Android / iOS) o un emulador configurado.

---

##  4. Pasos de Instalación
1. Clona el repositorio oficial: `git clone https://github.com/Yolijhunior/artesaniasperu.git`
2. Entra al directorio del proyecto: `cd PedidosApp`
3. Instala los paquetes y dependencias necesarias: `npm install`

---

## 5. Pasos de Ejecución
1. Inicia el servidor de desarrollo local mediante Expo: `npx expo start`
2. Escanea el código QR generado en la terminal utilizando la aplicación **Expo Go** en tu dispositivo móvil.

---

##  6. Estructura del Proyecto
La arquitectura se organiza bajo una separación clara de responsabilidades:
```text
PedidosApp/
├── assets/                  # Recursos gráficos e imágenes estáticas
├── src/
│   ├── app/
│   │   └── navigation/      # Configuración de rutas y navegadores (AppNavigator.tsx)
│   ├── domain/
│   │   ├── models/          # Interfaces y modelos de datos (Pedido.ts)
│   │   └── repositories/    # Lógica de repositorios locales
│   ├── infrastructure/
│   │   ├── database/        # Conexión y esquemas de SQLite (sqlite.ts)
│   │   └── services/        # Conexión con servicios HTTP / API REST (apiService.ts)
│   ├── utils/               # Funciones de validación de datos y manejo de errores
│   └── constants/           # Constantes globales de la aplicación y endpoints
├── App.tsx                  # Componente raíz de la aplicación
├── app.json                 # Configuración general de Expo
└── package.json             # Dependencias del proyecto
```

## 7. Funcionalidades Implementadas
Autenticación: Pantalla de acceso inicial al sistema.

CRUD Local (SQLite):

Crear: Registro con validaciones estrictas de campos y cantidades.

Leer: Listado de pedidos filtrados por estado y barra de búsqueda predictiva.

Actualizar: Interfaz dedicada (EditarPedidoScreen) con selectores de estado y control numérico.

Eliminar: Borrado seguro de registros desde vistas de detalle o listado.

Consumo de API REST: Módulo conectado a catálogos externos para la selección automatizada de productos y asignación estricta de precios oficiales.

Navegación Modular: Estructura basada en React Navigation.

 8. Cómo Probar el CRUD con SQLite
Inicia sesión en la aplicación.

Presiona el botón flotante ＋ para añadir un nuevo pedido.

Completa los campos obligatorios (Cliente, selección de producto proveniente de la API, cantidad y precio autogestionado) y guarda. Los datos se almacenarán en la base de datos local SQLite.

Haz clic en "Ver" para comprobar el flujo en la pantalla de Detalle, o en "Editar" para modificar sus atributos de forma persistente.

Usa el botón de Eliminar para remover registros del sistema.

 9. Cómo Probar el Consumo REST
Accede a la sección de Catálogo API desde el menú principal.

La aplicación ejecutará una petición HTTP asíncrona hacia el servicio externo configurado en apiService.ts.

Comprueba la lista de productos devuelta en tiempo real y verifica su vinculación directa con los módulos de creación y edición de pedidos.
