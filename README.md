# **LatinAd Challenge**

Este repositorio contiene la solución al desafío técnico propuesto por LatinAd para desarrollar una web que permita a los usuarios simular el costo de lanzar campañas publicitarias en pantallas digitales. La aplicación fue desarrollada utilizando tecnologías modernas como **React.js**, **Redux Toolkit**, **Redux-Saga**, **Tailwind CSS**, **Ant Design** y **Vite**.

---

## **Características principales**

La aplicación permite a los usuarios realizar las siguientes acciones:

1. Ingresar una fecha de inicio, fecha de fin y lugar o zona para buscar pantallas digitales disponibles en esas fechas.
2. Mostrar un listado de pantallas disponibles con filtros:
   - Por nombre.
   - Por tipo de ubicación.
   - Por rango de precios.
   - Por tamaño de la pantalla.
3. Mostrar un mapa interactivo con la ubicación de las pantallas.
4. Visualizar los detalles específicos de una pantalla en un modal (desde el listado o el mapa).
5. Agregar pantallas a un carrito y calcular automáticamente el costo total de la campaña.
6. Visualizar, gestionar y eliminar pantallas del carrito.
7. Exportar un presupuesto en formato PDF con las pantallas seleccionadas en el carrito, incluyendo el costo total.

---

## **Tecnologías utilizadas**

- **React.js**: Framework principal para construir la interfaz de usuario.
- **Redux Toolkit**: Manejo del estado global de la aplicación.
- **Redux-Saga**: Para manejar las operaciones asíncronas.
- **Vite**: Herramienta para crear un entorno de desarrollo rápido y eficiente.
- **Tailwind CSS**: Framework de CSS para diseño responsivo y personalización de estilos.
- **Ant Design**: Biblioteca de componentes UI para un diseño profesional.
- **React-Leaflet**: Librería utilizada para renderizar mapas interactivos.
- **Axios**: Para realizar solicitudes HTTP hacia la API de LatinAd.

---

## **Instalación**

Sigue estos pasos para instalar y ejecutar el proyecto en tu entorno local:

### **1. Clonar el repositorio**

```bash
git clone https://github.com/jongabee/07-latinad-challenge.git
cd 07-latinad-challenge
```

### **2. Instalar dependencias**

```bash
npm install
```

### **3. Ejecutar el servidor de desarrollo**

```bash
npm run dev
```

### **Uso de la aplicación**

1. En la página principal, selecciona las fechas de inicio y fin, y escribe el nombre del lugar o zona donde deseas buscar pantallas.
2. Pulsa el botón de búsqueda para ver las pantallas disponibles en un listado y un mapa interactivo.
3. Utiliza los filtros para refinar la búsqueda según tus necesidades.
4. Haz clic en una pantalla del listado o el mapa para ver sus detalles en un modal.
5. Agrega pantallas al carrito y verifica el costo total de la campaña.
6. Descarga un PDF del presupuesto con las pantallas seleccionadas.

## **Configuración de Variables de Entorno**

Este proyecto utiliza variables de entorno.

Para ejecutar el proyecto correctamente, sigue estos pasos:

1. Crea un archivo `.env` en la raíz del proyecto.
2. Define las siguientes variables en el archivo `.env`:

```env
VITE_API_BASE_URL=La URL base de la API que proporciona LatinAd
```

## **Nota importante**

Por motivos de privacidad, los valores reales de estas variables de entorno no se incluyen en este repositorio. Si necesitas acceso a los valores, comunícate con el administrador del proyecto o con el equipo técnico de LatinAd.

## **Datos de contacto**

Para más información o consultas, puedes contactarme:

<table align="center">
  <tr>
    <td align="center">
      <img src="https://res.cloudinary.com/dia2gautk/image/upload/v1719940434/cmoccvvllrsaay1kzsmw.jpg" alt="Jonatan Mosqueda" width="200" style="border-radius: 50%;">
      <br>
      <strong>Jonatan Mosqueda</strong>
    </td>
  </tr>

  <tr>
    <td align="center">
      <a href="https://github.com/Jongabee">
        <img src="https://img.shields.io/badge/GitHub-Profile-blue?style=flat-square&logo=github" alt="GitHub">
      </a>
      <a href="https://www.linkedin.com/in/jongabee/">
        <img src="https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat-square&logo=linkedin" alt="LinkedIn">
      </a>
    </td>
  </tr>
</table>
