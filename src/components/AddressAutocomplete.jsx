'use client';
import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

export default function AddressAutocomplete({ value, onSelect }) {
    const [query, setQuery] = useState(value || '');
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`
            );
            const data = await res.json();
            setResults(data);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const handleSelect = (place) => {
        setQuery(place.display_name);
        setResults([]);
        onSelect({
            address: place.display_name,
            lat: place.lat,
            lng: place.lon
        });
    };

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
            </div>
            <input
                type="text"
                placeholder="Buscar Sector..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {results.length > 0 && (
                <ul className="absolute z-10 bg-white text-black border w-full mt-1 rounded shadow">
                    {results.map((place) => (
                        <li
                            key={place.place_id}
                            onClick={() => handleSelect(place)}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                            {place.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
