import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
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

    const parseDate = (d: any) => {
      if (!d) return new Date();
      if (typeof d === 'number') return new Date(Math.round((d - 25569) * 86400 * 1000));
      if (typeof d === 'string') {
        const p = d.split(/[/-]/);
        if (p.length === 3 && parseInt(p[0]) > 12) {
          const dt = new Date(`${p[2]}-${p[1]}-${p[0]}`);
          if (!isNaN(dt.getTime())) return dt;
        }
      }
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? new Date() : dt;
    };

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

        const sppgData: any = {
          namaSppg: row.namaSppg || '-',
          kodeSppg: row.kodeSppg || `KODE-${ts}-${i}`,
          idSppg: row.idSppg || `SPPG-${ts}-${i}`,
          nomorBaVerval: row.nomorBaVerval || '-',
          tanggalBaVerval: parseDate(row.tanggalBaVerval),
          statusOperasional: row.statusOperasional || 'Beroperasi',
          tanggalOperasional: parseDate(row.tanggalOperasional),
          provinsi: row.provinsi || '-',
          kabKota: row.kabKota || '-',
          kecamatan: row.kecamatan || '-',
          kelurahanDesa: row.kelurahanDesa || '-',
          alamat: row.alamat || '-',
          kodePos: row.kodePos?.toString() || '-',
          posisiLatitude: row.posisiLatitude || null,
          posisiLongitude: row.posisiLongitude || null,
          jenisBangunan: row.jenisBangunan || '-',
          jenisSppg: row.jenisSppg || '-',
        };

        if (row.kasatpelNama) {
          sppgData.kasatpel = {
            create: {
              nama: row.kasatpelNama,
              email: row.kasatpelEmail || '-',
              noHp: row.kasatpelNoHp || '-'
            }
          };
        }

        if (row.mitraJenis || row.mitraNama) {
          sppgData.mitraEksternal = {
            create: {
              jenisMitra: row.mitraJenis || '-',
              namaMitra: row.mitraNama || '-',
              namaPimpinan: row.mitraPimpinan || '-',
              noHp: row.mitraNoHp || '-',
              email: row.mitraEmail || null,
              bentukDukungan: row.mitraDukungan || '-',
              provinsi: row.mitraProvinsi || '-',
              kabKota: row.mitraKabKota || '-',
              kecamatan: row.mitraKecamatan || '-',
              kelurahanDesa: row.mitraKelurahan || '-',
              alamat: row.mitraAlamat || '-',
              kodePos: row.mitraKodePos || '-'
            }
          };
        }

        if (row.yayasanNama) {
          sppgData.yayasan = {
            create: {
              namaYayasan: row.yayasanNama,
              npwp: row.yayasanNpwp || '-',
              provinsi: row.yayasanProvinsi || '-',
              kabKota: row.yayasanKabKota || '-',
              kecamatan: row.yayasanKecamatan || '-',
              kelurahanDesa: row.yayasanKelurahan || '-',
              alamat: row.yayasanAlamat || '-',
              kodePos: row.yayasanKodePos || '-',
              email: row.yayasanEmail || '-',
              teleponHp: row.yayasanTelepon || null
            }
          };
        }

        if (row.bankNama || row.bankNomor) {
          sppgData.rekeningBank = {
            create: {
              namaBank: row.bankNama || '-',
              nomorRekening: row.bankNomor || '-',
              namaPemilikRekening: row.bankPemilik || '-',
              namaBankVirtualAccount: row.bankVaNamaBank || '-',
              nomorVirtualAccount: row.bankVaNomor || '-',
              namaVirtualAccount: row.bankVaNama || '-'
            }
          };
        }

        if (row.perwakilanNama) {
          sppgData.perwakilanYayasan = {
            create: {
              namaPerwakilan: row.perwakilanNama,
              nik: row.perwakilanNik || '-',
              email: row.perwakilanEmail || '-',
              noHp: row.perwakilanNoHp || '-'
            }
          };
        }

        const existingUser = await prisma.user.findUnique({
          where: { username }
        });

        const existingSppg = await prisma.profilSppg.findFirst({
          where: {
            OR: [
              { idSppg: sppgData.idSppg },
              { kodeSppg: sppgData.kodeSppg }
            ]
          }
        });

        // Detach and delete existing SPPG if it conflicts with the new data
        if (existingSppg) {
          await prisma.user.updateMany({
            where: { profilSppgId: existingSppg.id },
            data: { profilSppgId: null }
          });
          await prisma.profilSppg.delete({ where: { id: existingSppg.id } });
        }

        // Overwrite existing user or create a new one
        if (existingUser) {
          // Clean up old user's SPPG if they had a different one
          if (existingUser.profilSppgId && existingUser.profilSppgId !== existingSppg?.id) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { profilSppgId: null }
            });
            await prisma.profilSppg.delete({ where: { id: existingUser.profilSppgId } });
          }

          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              password: defaultPassword,
              profilSppg: {
                create: sppgData
              }
            }
          });
        } else {
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
        }
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
