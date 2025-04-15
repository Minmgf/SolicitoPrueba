import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnects';
import Sector from '@/models/Sector';

export async function GET() {
    try {
        await dbConnect();
        const sectors = await Sector.find({});
        return NextResponse.json(sectors, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener sectores' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, address, coordinates, schedule } = body;

        if (!name || !address || !coordinates || !schedule) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
        }

        const newSector = await Sector.create({ name, address, coordinates, schedule });
        return NextResponse.json(newSector, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al crear sector', details: error.message }, { status: 500 });
    }
}
