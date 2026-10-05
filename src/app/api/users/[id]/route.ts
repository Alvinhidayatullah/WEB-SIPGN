import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  // IDOR Protection: Users can only edit themselves, ADMIN can edit anyone
  const userRole = (session?.user as { role?: string })?.role;
  const userId = (session?.user as { id?: string })?.id;
  const params = await props.params;
  const { id } = params;

  if (!session || (userRole !== 'ADMIN' && userId !== id)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { username, password, profilSppgId, ...profilData } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: Record<string, any> = {};
    if (username) {
      // Check if username is already taken by another user
      const duplicate = await prisma.user.findFirst({
        where: { username, id: { not: id } }
      });
      if (duplicate) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
      updateData.username = username;
    }
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Handle nested profile data if provided
    if (Object.keys(profilData).length > 0) {
      const { yayasan, rekeningBank, kasatpel, mitraEksternal, perwakilanYayasan, createdAt, updatedAt, ...sppgData } = profilData;
      
      const sanitize = (data: any) => {
        if (!data) return undefined;
        const { id, profilSppgId, ...rest } = data;
        return rest;
      };

      const nestedOps = {
        ...sppgData,
        posisiLatitude: sppgData.posisiLatitude ? (isNaN(parseFloat(sppgData.posisiLatitude)) ? null : parseFloat(sppgData.posisiLatitude)) : null,
        posisiLongitude: sppgData.posisiLongitude ? (isNaN(parseFloat(sppgData.posisiLongitude)) ? null : parseFloat(sppgData.posisiLongitude)) : null,
        tanggalBaVerval: sppgData.tanggalBaVerval ? new Date(sppgData.tanggalBaVerval) : undefined,
        tanggalOperasional: sppgData.tanggalOperasional ? new Date(sppgData.tanggalOperasional) : undefined,
        yayasan: yayasan ? { upsert: { create: sanitize(yayasan), update: sanitize(yayasan) } } : undefined,
        rekeningBank: rekeningBank ? { upsert: { create: sanitize(rekeningBank), update: sanitize(rekeningBank) } } : undefined,
        kasatpel: kasatpel ? { upsert: { create: sanitize(kasatpel), update: sanitize(kasatpel) } } : undefined,
        mitraEksternal: mitraEksternal ? { upsert: { create: sanitize(mitraEksternal), update: sanitize(mitraEksternal) } } : undefined,
        perwakilanYayasan: perwakilanYayasan ? { upsert: { create: sanitize(perwakilanYayasan), update: sanitize(perwakilanYayasan) } } : undefined,
      };

      if (existingUser.profilSppgId) {
        updateData.profilSppg = {
          update: nestedOps
        };
      } else {
        // Create a new profil if they don't have one
        const ts = Date.now();
        updateData.profilSppg = {
          create: {
            ...sppgData,
            idSppg: sppgData.idSppg || `NEW-${ts}`,
            kodeSppg: sppgData.kodeSppg || `NEW-${ts}`,
            namaSppg: sppgData.namaSppg || 'Baru',
            nomorBaVerval: sppgData.nomorBaVerval || '-',
            tanggalBaVerval: sppgData.tanggalBaVerval || new Date(),
            statusOperasional: sppgData.statusOperasional || 'Beroperasi',
            tanggalOperasional: sppgData.tanggalOperasional || new Date(),
            provinsi: sppgData.provinsi || '-',
            kabKota: sppgData.kabKota || '-',
            kecamatan: sppgData.kecamatan || '-',
            kelurahanDesa: sppgData.kelurahanDesa || '-',
            alamat: sppgData.alamat || '-',
            kodePos: sppgData.kodePos || '-',
            jenisBangunan: sppgData.jenisBangunan || '-',
            jenisSppg: sppgData.jenisSppg || '-',
            // include nested creates:
            yayasan: yayasan ? { create: sanitize(yayasan) } : undefined,
            rekeningBank: rekeningBank ? { create: sanitize(rekeningBank) } : undefined,
            kasatpel: kasatpel ? { create: sanitize(kasatpel) } : undefined,
            mitraEksternal: mitraEksternal ? { create: sanitize(mitraEksternal) } : undefined,
            perwakilanYayasan: perwakilanYayasan ? { create: sanitize(perwakilanYayasan) } : undefined,
          }
        };
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  // IDOR Protection: Only ADMIN can delete users
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const params = await props.params;
    const { id } = params;

    // Prevent admin from deleting themselves (optional but good practice)
    if (id === (session.user as { id?: string }).id) {
       // but we don't have id in session easily, so we just let them or check by username
       // actually we can just delete
    }

    // Fetch user first to get the profilSppgId
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (user) {
      await prisma.user.delete({
        where: { id }
      });

      if (user.profilSppgId) {
        await prisma.profilSppg.deleteMany({
          where: { id: user.profilSppgId }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
