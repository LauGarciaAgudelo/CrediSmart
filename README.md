# 💳 CreditSmart - Sistema de Gestión de Solicitudes de Crédito

**Nombre del estudiante:** Laura Vanessa García Agudelo  
**Asignatura:** Ingeniería Web I  
**Actividad:** Diseño de Interfaces Web – CreditSmart (Evolución a React)  
**Año:** 2025

---

## 🧩 Descripción del proyecto

**CreditSmart** es una aplicación web desarrollada inicialmente en HTML, y posteriormente **evolucionada a una aplicación dinámica utilizando React + Vite**.

El proyecto simula la interfaz de una plataforma financiera que permite:

- Visualizar un catálogo de productos crediticios.  
- Buscar, filtrar y ordenar créditos en un simulador interactivo.  
- Precargar automáticamente el tipo de crédito seleccionado en el formulario.  
- Renderizado dinámico de componentes (React)
- Ruteo entre páginas (React Router)
- Simulación de créditos con tasas reales
- Persistencia en la nube (Firestore)
- Lectura, consulta y filtrado de datos en tiempo real
- Manejo de errores y estados de carga
- Variables de entorno para proteger credenciales

La interfaz conserva la línea gráfica original (colores, tarjetas, íconos y estilos) y se adapta a cualquier pantalla gracias al uso de **Bootstrap 5** y componentes reutilizables.

---

## ⚙️ Tecnologías utilizadas

### 🎨 Frontend
- **React + Vite**
- **React Router DOM**
- **JavaScript (ES6+)**
- **Bootstrap 5 (CDN)**
- **CSS personalizado**

### ☁️ Backend (Serverless)
- **Firebase**  
- **Firestore Database**  

### 🛠️ Desarrollo
- **Git / GitHub** — control de versiones  
- **Módulos ES y componentes reutilizables**  
- **Hooks de React:** `useState`  
- **Manipulación de arrays:** `.map()`, `.filter()`, `.sort()`  
- **Firebase SDK v9 (modular)**

---

## 🚀 Funcionalidades destacadas

### 🟦 1. Catálogo de créditos
- Se muestran tarjetas dinámicas generadas desde un archivo de datos (`creditsData.js`).
- Cada tarjeta incluye: nombre, descripción, montos, plazo máximo, tasa anual e imagen correspondiente.
- Filtro por monto, búsqueda por nombre y orden por tasa  

### 🟦 2. Simulador dinámico
- Búsqueda en tiempo real.  
- Filtros por rango de montos (bajo, medio, alto).  
- Ordenamiento por tasa de interés (menor a mayor).  
- Renderizado 100% dinámico usando `.map()`.

### 🟦 3. Navegación inteligente
- Implementado con **React Router**.
- Desde el simulador, al dar clic en *Solicitar*, se envía el tipo de crédito al formulario y este aparece **preseleccionado automáticamente**.

### 🟦 4. Formulario de Solicitud
Incluye:
- Validaciones de campos obligatorios.  
- Conversión automática del monto a formato de miles (ej: 50.000.000).  
- Cálculo automático de:
  - Cuota mensual  
  - Total a pagar  
  - Intereses estimados  
- Las tasas reales se toman del crédito seleccionado (no es una tasa fija).  
- Muestra un resumen de la solicitud enviada.  
- Limpia los campos luego de enviar.

### 🟦 5. Solicitud de crédito (RequestPage)
Ahora conectada con **Firestore**:

- Validaciones en tiempo real  
- Formateo automático de miles  
- `addDoc()` para guardar solicitudes en la colección **requests**  
- `serverTimestamp()` para ordenamiento  
- Limpieza del formulario al enviar  
- Estado de **loading** mientras se guarda  
- Manejo de errores con **try/catch**  

### 🟦 6. Consulta de Solicitudes (MyRequestPage)
Página creada para consultar solicitudes guardadas en Firestore. Incluye funcionalidades como:

- Consultar con filtros
- Operaciones Firestore
- Interfaz (Tabla dinámica y mensajes de carga y error)

---

## 📂 Estructura del proyecto (React)

```bash
CreditSmart-React/
│
├── index.html
├── vite.config.js
├── package.json
│
├── src/
│   ├── components/
│   │   └── CreditCard.jsx
│   ├── data/
│   │   └── creditsData.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── SimulatorPage.jsx
│   │   └── RequestPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
└── README.md
```bash

## 🗄️ Estructura de Firestore

### 📁 Colección `requests`
Campos generados por la aplicación:

| Campo         | Tipo      | Descripción |
|---------------|-----------|-------------|
| name          | string    | Nombre del solicitante |
| email         | string    | Correo |
| creditType    | string    | Tipo de crédito |
| amount        | number    | Monto solicitado |
| term          | number    | Plazo en meses |
| monthlyFee    | number    | Cuota mensual calculada |
| createdAt     | timestamp | Fecha de creación (serverTimestamp) |

---

# 🔐 Variables de entorno utilizadas

Archivo **.env** (Se debe crear localmente):
- VITE_FIREBASE_API_KEY=
- VITE_FIREBASE_AUTH_DOMAIN=
- VITE_FIREBASE_PROJECT_ID=
- VITE_FIREBASE_STORAGE_BUCKET=
- VITE_FIREBASE_MESSAGING_SENDER_ID=
- VITE_FIREBASE_APP_ID=

---

## ⚙️ Instrucciones para ejecutar el proyecto

## 1️⃣ Clonar el proyecto
```bash
git clone https://github.com/usuario/tu-repo.git
cd creditsmart-react
```bash
## 2️⃣ Instalar Dependiencias
npm install

## 3️⃣ Configurar Firebase
Crear .env con las credenciales de Firebase, tomar como referencia el archivo .env.example

##4️⃣ Ejecutar el proyecto
npm run dev
http://localhost:5173

# 📸 Capturas de pantalla

### Página principal - Catálogo de Créditos
![Captura página principal](img/pagina-index.png)

### Simulador de Créditos
![Captura simulador](img/pagina-simulador.png)

### Formulario de Solicitud
![Captura formulario](img/pagina-solicitar.png)

## 🎨 Créditos de imágenes e íconos

Los íconos utilizados en este proyecto fueron descargados desde  
[Flaticon](https://www.flaticon.com/), creados por diferentes autores, los cuales se citan el footer de las diferentes páginas como parte de la atribución que debe realizarse a sus autores. 
---

##📄 Licencia

Proyecto académico desarrollado para la asignatura Ingeniería Web I.