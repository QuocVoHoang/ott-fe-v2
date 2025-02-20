import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// CHECK IF USERS ARE EXISTING

interface IUserMail {
  email: string
}


export async function POST(req: Request) {
  try {
    const { participants } = await req.json()

    const users = await prisma.users.findMany({
      where: {email: { in: participants}},
      select: { email: true },
    })
    const emails : string[] = []
    users.forEach((user: IUserMail) => {
      emails.push(user.email)
    });
    return NextResponse.json(emails as string[], { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
