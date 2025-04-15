// components/SectorCard.jsx
import { FaMapMarkerAlt, FaLocationArrow, FaClock } from 'react-icons/fa';

export default function SectorCard({ sector, distance }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold text-gray-800 mb-2">{sector.name}</h2>

            <p className="text-gray-600 text-sm mb-4">{sector.address}</p>

            <div className="space-y-2">
                <div className="flex items-center text-sm">
                    <div className="w-6">
                        <FaClock className="text-green-600" />
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {sector.schedule.open} - {sector.schedule.close}
                    </span>
                </div>

                <div className="flex items-center text-sm">
                    <div className="w-6">
                        <FaMapMarkerAlt className="text-blue-600" />
                    </div>
                    <span className={distance !== 'Calculando...' ? "font-medium" : "text-gray-500"}>
                        {distance} {distance !== 'Calculando...' && 'km'}
                    </span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                    <div className="w-6">
                        <FaLocationArrow className="text-gray-400" />
                    </div>
                    <span>
                        {parseFloat(sector.coordinates.lat).toFixed(5)}, {parseFloat(sector.coordinates.lng).toFixed(5)}
                    </span>
                </div>
            </div>
        </div>
    );
}