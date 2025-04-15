'use client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getDistanceFromLatLonInKm } from '@/lib/haversine';
import { isInSchedule } from '@/lib/isInSchedule';
import { FaMapMarkerAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NearbyPage() {
    const { data: sectors, error, isLoading } = useSWR('/api/sectors', fetcher, {
        refreshInterval: 5000,
    });
    const [userCoords, setUserCoords] = useState(null);
    const [locationError, setLocationError] = useState(false);
    const [filteredSectors, setFilteredSectors] = useState([]);

    // Get user location on component mount - reusing logic from HomePage
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserCoords({ lat: latitude, lng: longitude });
            },
            () => {
                setLocationError(true);
            },
            {
                timeout: 8000,
                maximumAge: 0,
                enableHighAccuracy: true,
            }
        );
    }, []);

    // Filter sectors based on location and schedule
    useEffect(() => {
        if (!sectors || !userCoords) return;
        const available = sectors.filter((sector) => {
            // Check if sector has valid coordinates
            if (!sector.coordinates || !sector.coordinates.lat || !sector.coordinates.lng) {
                return false;
            }

            const dist = getDistanceFromLatLonInKm(
                userCoords.lat,
                userCoords.lng,
                sector.coordinates.lat,
                sector.coordinates.lng
            );
            const isOpen = isInSchedule(sector.schedule.open, sector.schedule.close);
            return dist <= 5 && isOpen;
        });
        setFilteredSectors(available);
    }, [sectors, userCoords]);

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
            </div>
        </div>
    );

    return (
        <div className="min-h-screen ">
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Sectores con cobertura actual
                    </h1>
                    <p className="text-gray-400 mt-3 text-lg">
                        Servicios disponibles en tu zona y horario actual
                    </p>
                </header>

                {locationError && (
                    <div className="mb-6 p-5 bg-yellow-900/30 border-l-4 border-yellow-500 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FaExclamationTriangle className="text-yellow-500 h-5 w-5" />
                            </div>
                            <div className="ml-3">
                                <p className="text-yellow-200">
                                    No se pudo obtener tu ubicación. Esta función requiere permisos de ubicación.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {userCoords && (
                    <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                            <FaMapMarkerAlt className="text-blue-500 h-5 w-5 mr-2" />
                            <p className="text-gray-300">
                                Tu ubicación: <span className="text-blue-400 font-medium">Lat: {userCoords.lat.toFixed(5)}, Lng: {userCoords.lng.toFixed(5)}</span>
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    {userCoords ? (
                        filteredSectors.length > 0 ? (
                            <div className="grid gap-4">
                                {filteredSectors.map((sector) => (
                                    <div
                                        key={sector._id}
                                        className="bg-gray-800/50 p-5 rounded-xl shadow-md border border-gray-700 hover:border-blue-500 transition-all duration-200"
                                    >
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">{sector.name}</h3>
                                                <div className="flex items-start mb-2">
                                                    <FaMapMarkerAlt className="text-blue-500 h-5 w-5 mr-2 mt-1" />
                                                    <p className="text-gray-300">{sector.address}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 md:mt-0 flex items-center bg-gray-700/50 px-3 py-2 rounded-lg">
                                                <FaClock className="text-green-400 h-4 w-4 mr-2" />
                                                <p className="text-green-300 font-medium">
                                                    {sector.schedule.open} - {sector.schedule.close}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center">
                                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                            <p className="text-green-400 text-sm font-medium">Abierto ahora</p>

                                            {userCoords && sector.coordinates && (
                                                <div className="ml-6 flex items-center">
                                                    <span className="text-gray-400 text-sm">
                                                        {getDistanceFromLatLonInKm(
                                                            userCoords.lat,
                                                            userCoords.lng,
                                                            sector.coordinates.lat,
                                                            sector.coordinates.lng
                                                        ).toFixed(2)} km de distancia
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg text-center border border-gray-700">
                                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-medium text-white mb-2">No hay servicios disponibles</h3>
                                <p className="text-gray-400">
                                    No encontramos sectores con cobertura en tu zona o en el horario actual.
                                </p>
                            </div>
                        )
                    ) : !locationError ? (
                        <div className="flex items-center justify-center p-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="ml-4 text-gray-300">Obteniendo tu ubicación...</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}