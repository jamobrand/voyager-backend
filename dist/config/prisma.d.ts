import { PrismaClient } from '@prisma/client';
declare global {
    var prisma: PrismaClient | undefined;
}
declare const prismaClient: PrismaClient;
export default prismaClient;
