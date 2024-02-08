import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

export async function generateAICompletionRoute(app: FastifyInstance) {
  app.post('/ai/complete', async (req, reply) => {
        const bodySchema = z.object({
        videoId: z.string().uuid(),
        template: z.string(),
        temperature: z.number().min(0).max(1).default(0.5)
    })

    const { videoId, template, temperature } = bodySchema.parse(req.body)

    // busca o video no banco
    const video = await prisma.video.findUniqueOrThrow({
        where:{
            id: videoId,
        }
    })

    // se não houver uma transcrição para esse video da erro 
    if(!video.transcription){
        return reply.status(400).send({ error: 'Video transcription was not generated.' })
    }

    // menssagem do prompt, troca a transcrião do video,
    // que será em um textbox vazia e troca pela transcrição ja gerada
    const promptMessage = template.replace('{transcription}', video.transcription)

    // chamada para openai
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        temperature,
        messages: [
            // messagem como se fosse o user enviando para ia 
            // e o conteudo dessa mensagem seria o proprio prompt
            { role: 'user', content: promptMessage }
        ]
    })

    return response

  })
}