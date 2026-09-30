import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  // IDOR Protection / Authorization: Only ADMIN can list all users
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Default to a maximum of 50 per page to protect server
    const take = Math.min(limit, 50);
    const skip = (page - 1) * take;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        include: {
          profilSppg: {
            include: {
              yayasan: true,
              rekeningBank: true,
              kasatpel: true,
              mitraEksternal: true,
              perwakilanYayasan: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count()
    ]);
    
    return NextResponse.json({
      data: users,
      meta: {
        total,
        page,
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // IDOR Protection: Only ADMIN can create new users
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { username, password, email, role, copyFromUserId, profilSppgId, ...profilData } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilSppgCreate = undefined;
    if (Object.keys(profilData).length > 0) {
      const { yayasan, rekeningBank, kasatpel, mitraEksternal, perwakilanYayasan, createdAt, updatedAt, idSppg, ...sppgData } = profilData;
      
      const sanitize = (data: any) => {
        if (!data) return undefined;
        const { id, profilSppgId, ...rest } = data;
        return rest;
      };

      profilSppgCreate = {
        create: {
          ...sppgData,
          idSppg: idSppg || `SPPG-${Date.now()}`,
          yayasan: yayasan ? { create: sanitize(yayasan) } : undefined,
          rekeningBank: rekeningBank ? { create: sanitize(rekeningBank) } : undefined,
          kasatpel: kasatpel ? { create: sanitize(kasatpel) } : undefined,
          mitraEksternal: mitraEksternal?.length ? { create: mitraEksternal.map(sanitize) } : undefined,
          perwakilanYayasan: perwakilanYayasan?.length ? { create: perwakilanYayasan.map(sanitize) } : undefined
        }
      };
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'USER',
        profilSppg: profilSppgCreate
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
