# 📦 PedidosApp

Aplicación móvil desarrollada para la **gestión integral de pedidos**, consumo de **catálogos mediante API REST** y **autenticación de usuarios**.

---

## 📋 Tabla de contenidos

- [Descripción del proyecto](#-descripción-del-proyecto)
- [Tecnologías y herramientas usadas](#️-tecnologías-y-herramientas-usadas)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración de Firebase](#️-configuración-de-firebase)
- [Cómo ejecutar el proyecto](#-cómo-ejecutar-el-proyecto)
- [Cómo probar el Login](#-cómo-probar-el-login)
- [Cómo probar el CRUD de Pedidos](#-cómo-probar-el-crud-de-pedidos)
- [Cómo probar SQLite](#-cómo-probar-sqlite)
- [Cómo probar el consumo de API REST](#-cómo-probar-el-consumo-de-api-rest)
- [Cómo probar Firestore o Realtime Database](#️-cómo-probar-firestore-o-realtime-database)
- [Cómo generar APK / AAB](#-cómo-generar-apk--aab)

---

## 📖 Descripción del proyecto

**PedidosApp** es una aplicación móvil multiplataforma (Android / iOS) construida con **React Native** y **Expo**, pensada para digitalizar el proceso de toma y gestión de pedidos de productos artesanales.

Entre sus principales funcionalidades se encuentran:

- Registro e inicio de sesión de usuarios mediante **Firebase Authentication**.
- Gestión completa (CRUD) de pedidos.
- Consumo de un catálogo de productos externo a través de una **API REST**.
- Persistencia y caché local de datos mediante **SQLite**, permitiendo trabajar sin conexión.
- Sincronización de la información en la nube usando **Firestore / Realtime Database**.

---

## 🛠️ Tecnologías y Herramientas Usadas

<p align="left">
  <img src="https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native"/>
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
</p>

---

## 📂 Estructura del proyecto

```
ARTESANIASPERU/
├── __tests__/                        # Pruebas unitarias
├── .bundle
├── .expo
├── assets/
│   └── logo.png
├── src/
│   ├── domain/
│   │   ├── models/                   # Entidades y modelos de datos
│   │   └── repositories/             # Contratos/repositorios de acceso a datos
│   ├── infrastructure/
│   │   ├── database/                 # Configuración de SQLite
│   │   ├── firebase/                 # Configuración de Firebase (firebaseConfig.ts)
│   │   └── services/                 # Servicios y consumo de API REST
│   └── presentation/
│       ├── components/               # Componentes reutilizables de UI
│       ├── context/                  # Contextos de React (estado global)
│       ├── hooks/                    # Custom hooks
│       ├── navigation/               # Configuración de navegación
│       ├── screens/                  # Pantallas (ListadoPedidosScreen, CatalogoApiScreen, etc.)
│       └── utils/                    # Funciones utilitarias
├── .eslintrc.js
├── .gitignore
├── .prettierrc.js
├── .watchmanconfig
├── app.json                          # Configuración de Expo
├── App.tsx
├── babel.config.js
├── eas.json                          # Configuración de EAS Build
├── Gemfile
├── index.js
├── jest.config.js
├── metro.config.js
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

> Estructura basada en la organización real del proyecto (arquitectura por capas: `domain`, `infrastructure`, `presentation`).

---

## ✅ Requisitos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

- **Node.js** (versión 18 o superior recomendada).
- **npm**.
- **Expo CLI**.
- **EAS CLI** (opcional, para generar compilaciones).
- **Expo Go** instalado en tu dispositivo móvil para realizar pruebas locales.

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Yolijhunior/artesaniasperu
cd PedidosApp
```

### 2. Instalar las dependencias

```bash
npm install
```

---

## ⚙️ Configuración de Firebase

La aplicación utiliza **Firebase** para la autenticación de usuarios y el almacenamiento de información.

Configura tus credenciales en:

`src/infrastructure/firebase/firebaseConfig.ts`

Asegúrate de tener habilitado en la consola de Firebase:

- **Authentication**
  - Email/Password
- **Firestore Database** o **Realtime Database**

> ⚠️ No compartas públicamente tus credenciales o claves privadas de Firebase.

---

## ▶️ Cómo ejecutar el proyecto

Para iniciar el servidor de desarrollo con Metro Bundler:

```bash
npx expo start
```

### 📱 Dispositivo físico

Escanea el código QR que aparece en la terminal utilizando **Expo Go** en Android o iOS.

### 🤖 Emulador Android

Presiona la tecla `a` en la terminal para abrir el emulador de Android.

### 🍎 Simulador iOS

Presiona la tecla `i` en la terminal para abrir el simulador de iOS.

---

## 👤 Cómo probar el Login

1. Abre la aplicación en tu dispositivo o emulador.
2. Si no cuentas con una cuenta, selecciona la opción **Registrarse**.
3. Ingresa tus datos.
4. La cuenta será registrada mediante **Firebase Authentication**.
5. Inicia sesión con tu correo electrónico y contraseña.
6. Accede al menú principal y al listado de pedidos.

---

## 📝 Cómo probar el CRUD de Pedidos

Una vez autenticado, podrás gestionar los pedidos mediante las siguientes operaciones:

### ➕ Crear — Create

Ve al formulario de pedidos para registrar un nuevo pedido seleccionando productos del catálogo.

### 📖 Leer — Read

Visualiza la lista completa de pedidos registrados desde:

`ListadoPedidosScreen`

### ✏️ Actualizar — Update

1. Selecciona un pedido.
2. Accede al detalle.
3. Selecciona la opción **Editar**.
4. Modifica los datos.
5. Guarda los cambios.

### 🗑️ Eliminar — Delete

1. Accede al detalle del pedido.
2. Selecciona **Eliminar**.
3. Confirma la acción.
4. El pedido será eliminado.

---

## 💾 Cómo probar SQLite

La aplicación implementa almacenamiento local mediante **expo-sqlite** para mejorar la persistencia y caché de datos offline en el dispositivo.

Los datos locales son gestionados automáticamente por la aplicación durante las operaciones correspondientes (creación, edición y eliminación de pedidos), permitiendo que la información esté disponible incluso sin conexión a internet.

---

## 🌐 Cómo probar el consumo de API REST

Dirígete a la pantalla:

`CatalogoApiScreen`

La aplicación realizará una petición HTTP mediante `fetch` a la API REST configurada para obtener la lista de productos artesanales externos.

Podrás visualizar en tiempo real:

- 🖼️ Imágenes
- 🏷️ Nombres de productos
- 💲 Precios unitarios

---

## ☁️ Cómo probar Firestore o Realtime Database

Para comprobar la sincronización con Firebase:

1. Crea un pedido dentro de la aplicación.
2. Modifica un pedido existente.
3. Elimina un pedido.
4. Ingresa a la **Consola de Firebase**.
5. Dirígete a **Firestore Database** o **Realtime Database**.
6. Verifica que los cambios se hayan guardado correctamente.

---

## 📦 Cómo generar APK / AAB

### 🤖 Generar APK para Android

Para generar un archivo `.apk` instalable directamente en Android utilizando EAS:

```bash
eas build -p android --profile preview --clear-cache
```

Al finalizar la compilación, EAS proporcionará un enlace de descarga.

---

<p align="center">
  📱 <strong>PedidosApp</strong>
</p>

<p align="center">
  Hecho con ❤️ usando React Native, Expo, TypeScript y Firebase.
</p>
