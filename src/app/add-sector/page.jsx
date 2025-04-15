'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { FaMapMarkerAlt, FaClock, FaBuilding } from 'react-icons/fa';

export default function AddSectorPage() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        lat: '',
        lng: '',
        open: '',
        close: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { name, address, lat, lng, open, close } = formData;

        if (!name || !address || !lat || !lng || !open || !close) {
            toast.error('Completa todos los campos');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/sectors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    address,
                    coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
                    schedule: { open, close }
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Error al crear sector');

            toast.success('Sector creado exitosamente');
            setFormData({ name: '', address: '', lat: '', lng: '', open: '', close: '' });
        } catch (err) {
            toast.error(`${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen ">
            <div className="max-w-2xl mx-auto p-6 bg-gray-800/50 rounded-xl shadow-xl border border-gray-700">
                <h1 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Registrar nuevo sector</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                    <div className=" mb-4 border-b border-gray-600 pb-2">
                        <label className="block text-gray-300 font-medium mb-1">Buscar Sector</label>
                        <AddressAutocomplete
                            value={formData.address}
                            onSelect={({ address, lat, lng }) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    address,
                                    lat,
                                    lng,
                                }));
                            }}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                        <label className="block text-gray-300 font-medium mb-1">Nombre del sector</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaBuilding className="text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nombre del sector"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>


                    <div className="space-y-2">
                        <label className="block text-gray-300 font-medium mb-1">Dirección (manual)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaMapMarkerAlt className="text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="address"
                                placeholder="Dirección completa"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-gray-300 font-medium mb-1">Latitud</label>
                            <input
                                type="text"
                                name="lat"
                                placeholder="Ej: -33.4489"
                                value={formData.lat}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-gray-300 font-medium mb-1">Longitud</label>
                            <input
                                type="text"
                                name="lng"
                                placeholder="Ej: -70.6693"
                                value={formData.lng}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-300 font-medium mb-1">Horario de funcionamiento</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaClock className="text-gray-500" />
                                </div>
                                <input
                                    type="time"
                                    name="open"
                                    value={formData.open}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400">
                                    Apertura
                                </span>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaClock className="text-gray-500" />
                                </div>
                                <input
                                    type="time"
                                    name="close"
                                    value={formData.close}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400">
                                    Cierre
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full p-4 rounded-lg font-medium text-white 
                            ${loading ? 'bg-gray-600' : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'} 
                            transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    <span>Procesando...</span>
                                </div>
                            ) : 'Registrar Sector'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}