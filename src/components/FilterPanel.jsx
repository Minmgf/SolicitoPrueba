import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

export default function FilterPanel({
    onSearchChange,
    onDistanceFilterChange,
    locationError,
    hasUserCoords
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [distanceFilter, setDistanceFilter] = useState('all');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        onSearchChange(value);
    };

    const handleDistanceChange = (e) => {
        const value = e.target.value;
        setDistanceFilter(value);
        onDistanceFilterChange(value);
    };

    return (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar por nombre
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="search"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="Buscar sectores..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="sm:w-64">
                    <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
                        Filtrar por distancia
                    </label>
                    <select
                        id="distance"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={distanceFilter}
                        onChange={handleDistanceChange}
                        disabled={locationError || !hasUserCoords}
                    >
                        <option value="all">Todas las distancias</option>
                        <option value="under1">Menos de 1 km</option>
                        <option value="1to5">Entre 1 y 5 km</option>
                        <option value="5to10">Entre 5 y 10 km</option>
                        <option value="over10">Más de 10 km</option>
                    </select>
                </div>
            </div>
        </div>
    );
}