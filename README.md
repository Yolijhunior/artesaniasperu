# PedidosApp 

Aplicación móvil desarrollada para la **gestión integral de pedidos**, consumo de **catálogos mediante API REST** y **autenticación de usuarios**.

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

##  Requisitos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

- **Node.js** (versión 18 o superior recomendada).
- **npm**.
- **Expo CLI**.
- **EAS CLI** (opcional para generar compilaciones).
- **Expo Go** instalado en tu dispositivo móvil para realizar pruebas locales.

---

##  Instalación

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

##  Configuración de Firebase

La aplicación utiliza **Firebase** para la autenticación de usuarios y almacenamiento de información.

Configura tus credenciales en:

`src/infrastructure/firebase/firebaseConfig.ts`

Asegúrate de tener habilitado:

-  **Authentication**
  - Email/Password
-  **Firestore Database** o **Realtime Database**

>  No compartas públicamente tus credenciales o claves privadas de Firebase.

---

##  Cómo ejecutar el proyecto

Para iniciar el servidor de desarrollo con Metro Bundler:

```bash
npx expo start
```

###  Dispositivo físico

Escanea el código QR que aparece en la terminal utilizando **Expo Go** en Android o iOS.

###  Emulador Android

Presiona la tecla `a` en la terminal para abrir el emulador de Android.

###  Simulador iOS

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

##  Cómo probar el CRUD de Pedidos

Una vez autenticado, podrás gestionar los pedidos mediante las operaciones CRUD.

###  Crear — Create

Ve al formulario de pedidos para registrar un nuevo pedido seleccionando productos del catálogo.

###  Leer — Read

Visualiza la lista completa de pedidos registrados desde:

`ListadoPedidosScreen`

###  Actualizar — Update

1. Selecciona un pedido.
2. Accede al detalle.
3. Selecciona la opción **Editar**.
4. Modifica los datos.
5. Guarda los cambios.

### Eliminar — Delete

1. Accede al detalle del pedido.
2. Selecciona **Eliminar**.
3. Confirma la acción.
4. El pedido será eliminado.

---

## 💾 Cómo probar SQLite

La aplicación implementa almacenamiento local mediante **expo-sqlite** para mejorar la persistencia y caché de datos offline en el dispositivo.

Los datos locales son gestionados automáticamente por la aplicación durante las operaciones correspondientes.

---

##  Cómo probar el consumo de API REST

Dirígete a la pantalla:

`CatalogoApiScreen`

La aplicación realizará una petición HTTP mediante `fetch` a la API REST configurada para obtener la lista de productos artesanales externos.

Podrás visualizar en tiempo real:

-  Imágenes
-  Nombres de productos
-  Precios unitarios

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

##  Cómo generar APK / AAB

###  Generar APK para Android

Para generar un archivo `.apk` instalable directamente en Android utilizando EAS:

```bash
eas build -p android --profile preview --clear-cache
```

Al finalizar la compilación, EAS proporcionará un enlace de descarga.





<p align="center">
  📱 <strong>PedidosApp</strong>
</p>

<p align="center">
  Hecho con ❤️ usando React Native, Expo, TypeScript y Firebase.
</p>
