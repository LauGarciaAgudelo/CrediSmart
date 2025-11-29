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
- Diligenciar una solicitud de crédito con cálculo automático de cuota mensual.  
- Navegar entre páginas usando **React Router**.  
- Precargar automáticamente el tipo de crédito seleccionado en el formulario.  

La interfaz conserva la línea gráfica original (colores, tarjetas, íconos y estilos) y se adapta a cualquier pantalla gracias al uso de **Bootstrap 5** y componentes reutilizables.

---

## ⚙️ Tecnologías utilizadas

### 🎨 Frontend
- **React + Vite**
- **React Router DOM**
- **JavaScript (ES6+)**
- **Bootstrap 5 (CDN)**
- **CSS personalizado**

### 🛠️ Desarrollo
- **Git / GitHub** — control de versiones  
- **Módulos ES y componentes reutilizables**  
- **Hooks de React:** `useState`  
- **Manipulación de arrays:** `.map()`, `.filter()`, `.sort()`  

---

## 🚀 Funcionalidades destacadas

### 🟦 1. Catálogo de créditos
- Se muestran tarjetas dinámicas generadas desde un archivo de datos (`creditsData.js`).
- Cada tarjeta incluye: nombre, descripción, montos, plazo máximo, tasa anual e imagen correspondiente.

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

## ⚙️ Instrucciones para ejecutar el proyecto

1. **Descargar o clonar** este repositorio en un computador.
2. Abrir la carpeta `CreditSmart/`.
3. Hacer **doble clic** sobre el archivo `index.html` para visualizar el sitio en el navegador.

## Capturas de pantalla

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