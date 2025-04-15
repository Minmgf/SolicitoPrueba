# Aplicación de Gestión de Sectores

Esta aplicación permite visualizar, filtrar y registrar sectores geográficos con información sobre su ubicación y horarios de atención. Está desarrollada con Next.js y utiliza geolocalización para mostrar sectores cercanos y disponibles en tiempo real.

## LiveDemo

Puedes ver una demostración en vivo de la aplicación en:
[https://solicito-prueba.vercel.app/](https://solicito-prueba.vercel.app/)

[![LiveDemo](https://img.shields.io/badge/Ver%20Demo-Online-blue.svg)](https://solicito-prueba.vercel.app/)

## Características

- **Vista de sectores**: Visualización de todos los sectores registrados con filtros por nombre y distancia.
- **Sectores cercanos**: Muestra sectores disponibles en un radio de 5km y que estén abiertos en el horario actual.
- **Registro de sectores**: Formulario para añadir nuevos sectores con autocompletado de direcciones.
- **Geolocalización**: Utiliza la API de geolocalización del navegador para mostrar sectores cercanos al usuario.
- **Actualización en tiempo real**: Refresca los datos cada 5 segundos para mantener la información actualizada.
- **Interfaz adaptable**: Diseño responsive que se adapta a diferentes dispositivos.

## Tecnologías utilizadas

- **Frontend**:
  - Next.js (App Router)
  - TailwindCSS
  - React Icons
  - SWR para fetching de datos

- **Backend**:
  - Next.js (Api Routes) / Node.js

- **Bases de Datos**:
  - MongoDB NoSQL

- **Utilitarios**:
  - Haversine (cálculo de distancias geográficas)
  - Verificación de horarios
  - React Hot Toast para notificaciones

## Estructura del proyecto

```
/
├── app/                    # App Router de Next.js
│   ├── page.jsx            # Página principal (listado de sectores)
│   ├── add-page/           # Página para añadir sectores
│   └── nearby/             # Página de sectores cercanos
├── components/             # Componentes reutilizables
│   ├── AddressAutocomplete.jsx
│   ├── FilterPanel.jsx
│   └── SectorCard.jsx
├── lib/                    # Utilidades
│   ├── haversine.js        # Cálculo de distancias
│   └── isInSchedule.js     # Verificación de horarios
└── api/                    # API routes para CRUD de sectores
    └── sectors/
        └── route.js
```

## Páginas principales

### HomePage (`page.jsx`)

Muestra todos los sectores registrados con opciones para filtrar por nombre y distancia. Utiliza geolocalización para calcular distancias entre el usuario y los sectores.

```jsx
// Características principales
- Filtrado por nombre (búsqueda de texto)
- Filtrado por distancia (menos de 1km, 1-5km, 5-10km, más de 10km)
- Visualización de información detallada de cada sector
- Interfaz con tema oscuro y diseño moderno
```

### AddSectorPage (`add-page/page.jsx`)

Permite registrar nuevos sectores con validación de datos y autocompletado de direcciones.

```jsx
// Campos del formulario
- Nombre del sector
- Dirección (con autocompletado)
- Coordenadas (latitud/longitud)
- Horario de apertura y cierre
```

### NearbyPage (`nearby/page.jsx`)

Muestra sectores que cumplen dos condiciones:
1. Están a menos de 5km de la ubicación del usuario
2. Están abiertos en el momento actual

```jsx
// Funcionalidades
- Detección automática de la ubicación del usuario
- Filtrado por disponibilidad actual (distancia y horario)
- Actualización en tiempo real
```

## API

La aplicación utiliza endpoints API para gestionar los sectores:

- `GET /api/sectors`: Obtiene todos los sectores registrados
- `POST /api/sectors`: Registra un nuevo sector

## Instalación y ejecución

1. Clonar el repositorio
   ```bash
   git clone https://github.com/Minmgf/SolicitoPrueba
   ```

2. Instalar dependencias
   ```bash
   npm install
   ```

3. Ejecutar en modo desarrollo
   ```bash
   npm run dev
   ```

5. Acceder a la aplicación en `http://localhost:3000`

## Despliegue

La aplicación está desplegada en Vercel. Para hacer tu propio despliegue:

```bash
npm run build
vercel deploy
```

## Consideraciones técnicas

- La aplicación utiliza el hook `useEffect` para obtener la ubicación del usuario al montar el componente.
- Se implementa `useSWR` para actualizar los datos de forma periódica y mantener la interfaz sincronizada.
- El cálculo de distancias se realiza mediante la fórmula de Haversine.
- La verificación de horarios compara la hora actual con los horarios registrados de cada sector.

## Prueba Tecnica Minmgf 2025