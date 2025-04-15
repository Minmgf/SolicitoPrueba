'use client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getDistanceFromLatLonInKm } from '@/lib/haversine';
import { FaExclamationTriangle, FaFile, FaTimes } from 'react-icons/fa';
import FilterPanel from '@/components/FilterPanel';
import SectorCard from '@/components/SectorCard';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const [userCoords, setUserCoords] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState('all');

  // Obtener ubicación del usuario al iniciar
  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada por tu navegador');
      setLocationError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
      },
      () => {
        alert('No se pudo obtener la ubicación del usuario');
        setLocationError(true);
      },
      {
        timeout: 8000,
        maximumAge: 0,
        enableHighAccuracy: true,
      }
    );
  }, []);

  const { data, error, isLoading } = useSWR('/api/sectors', fetcher, {
    refreshInterval: 5000,
  });

  // Filtrar los datos según los criterios de búsqueda y distancia
  const filteredData = data ? data.filter((sector) => {
    // Calcular distancia si las coordenadas están disponibles
    let distance = null;
    if (userCoords && sector.coordinates) {
      distance = getDistanceFromLatLonInKm(
        userCoords.lat,
        userCoords.lng,
        sector.coordinates.lat,
        sector.coordinates.lng
      );
    }

    // Filtro por nombre (case-insensitive)
    const nameMatch = sector.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtro por distancia
    let distanceMatch = true;
    if (distanceFilter !== 'all' && distance !== null) {
      if (distanceFilter === 'under1') {
        distanceMatch = distance < 1;
      } else if (distanceFilter === '1to5') {
        distanceMatch = distance >= 1 && distance <= 5;
      } else if (distanceFilter === '5to10') {
        distanceMatch = distance > 5 && distance <= 10;
      } else if (distanceFilter === 'over10') {
        distanceMatch = distance > 10;
      }
    }

    return nameMatch && distanceMatch;
  }) : [];

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <p className="text-gray-300 font-medium text-lg">Cargando sectores...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-xl border border-gray-700">
        <div className="text-red-500 text-6xl mb-6">⚠️</div>
        <p className="text-gray-200 font-medium text-xl mb-4">Error al cargar sectores.</p>
        <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Reintentar
        </button>
      </div>
    </div>
  );

  const clearFilters = () => {
    setSearchQuery('');
    setDistanceFilter('all');
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Sectores registrados</h1>
          <p className="text-gray-400 mt-3 text-lg">Listado actualizado de sectores y su información</p>
        </header>

        {locationError && (
          <div className="mb-6 p-5 bg-yellow-900/30 border-l-4 border-yellow-500 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="text-yellow-500 h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-yellow-200">
                  No se pudo obtener tu ubicación. Las distancias y filtros por distancia no estarán disponibles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Componente de Filtros */}
        <FilterPanel
          onSearchChange={setSearchQuery}
          onDistanceFilterChange={setDistanceFilter}
          locationError={locationError}
          hasUserCoords={!!userCoords}
        />

        {data && data.length === 0 ? (
          <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg text-center border border-gray-700">
            <FaFile className="mx-auto h-16 w-16 text-gray-500 mb-4" />
            <p className="mt-2 text-gray-300 text-xl">No hay sectores registrados aún.</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg text-center border border-gray-700">
            <FaTimes className="mx-auto h-16 w-16 text-gray-500 mb-4" />
            <p className="mt-2 text-gray-300 text-xl mb-4">No se encontraron sectores que coincidan con tu búsqueda.</p>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-gray-400 bg-gray-800/30 p-3 rounded-lg inline-block">
              Mostrando <span className="font-semibold text-blue-400">{filteredData.length}</span> de <span className="font-semibold text-blue-400">{data.length}</span> sectores
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((sector) => {
                const distance =
                  userCoords && sector.coordinates
                    ? getDistanceFromLatLonInKm(
                      userCoords.lat,
                      userCoords.lng,
                      sector.coordinates.lat,
                      sector.coordinates.lng
                    ).toFixed(2)
                    : 'Calculando...';

                return (
                  <SectorCard
                    key={sector._id}
                    sector={sector}
                    distance={distance}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}