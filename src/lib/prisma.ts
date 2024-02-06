import { PrismaClient } from "@prisma/client";

//conectando com o banco de dados
export const prisma = new PrismaClient()