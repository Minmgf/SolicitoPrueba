'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const linkClasses = (path) =>
        `px-3 py-2 rounded hover:bg-gray-700 ${pathname === path ? 'bg-gray-700 text-white' : 'text-gray-200'
        }`;

    return (
        <nav className="bg-gray-800 text-white p-4 mb-6">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/" className={linkClasses('/')}>
                    Inicio
                </Link>
                <Link href="/add-sector" className={linkClasses('/add-sector')}>
                    Registrar Sector
                </Link>
                <Link href="/nearby" className={linkClasses('/nearby')}>
                    Sectores Cercanos
                </Link>
            </div>
        </nav>
    );
}
