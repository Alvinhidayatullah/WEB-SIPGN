import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { users } = await request.json();
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const defaultPassword = await bcrypt.hash('mbg123', 10);
    const ts = Date.now();

    let successCount = 0;
    let errors = [];

    for (let i = 0; i < users.length; i++) {
      const row = users[i];
      try {
        const username = row.username || `user_${ts}_${i}`;
        
        // Skip if username exists
        const existing = await prisma.user.findUnique({ where: { username }});
        if (existing) {
          errors.push(`Baris ${i+1}: Username '${username}' sudah terdaftar.`);
          continue;
        }

        const sppgData = {
          namaSppg: row.namaSppg || '-',
          kodeSppg: row.kodeSppg || `KODE-${ts}-${i}`,
          idSppg: row.idSppg || `SPPG-${ts}-${i}`,
          nomorBaVerval: row.nomorBaVerval || '-',
          tanggalBaVerval: row.tanggalBaVerval ? new Date(row.tanggalBaVerval) : new Date(),
          statusOperasional: row.statusOperasional || 'Beroperasi',
          tanggalOperasional: row.tanggalOperasional ? new Date(row.tanggalOperasional) : new Date(),
          provinsi: row.provinsi || '-',
          kabKota: row.kabKota || '-',
          kecamatan: row.kecamatan || '-',
          kelurahanDesa: row.kelurahanDesa || '-',
          alamat: row.alamat || '-',
          kodePos: row.kodePos?.toString() || '-',
          jenisBangunan: row.jenisBangunan || '-',
          jenisSppg: row.jenisSppg || '-',
        };

        await prisma.user.create({
          data: {
            username,
            password: defaultPassword,
            role: 'USER',
            profilSppg: {
              create: sppgData
            }
          }
        });
        successCount++;
      } catch (err: any) {
        errors.push(`Baris ${i+1}: Gagal memproses data (${err.message.substring(0, 50)}...)`);
      }
    }

    return NextResponse.json({ success: true, successCount, errors });
  } catch (error) {
    console.error("Error importing:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
