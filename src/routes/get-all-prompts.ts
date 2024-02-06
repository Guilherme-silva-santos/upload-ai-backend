import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export function getAllPromptsRoute(app: FastifyInstance){
    app.get('/prompts', async () => {
        const prompts =  await prisma.prompt.findMany()
    
        return prompts
    })
}