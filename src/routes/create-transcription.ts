import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function createTranscriptionRoute(app: FastifyInstance) {
    // como a criação da transcrição depende de um video 
    // é importante passar o id do vídeo n url
  app.post('/videos/:videoId/transcription', async (req) => {

    // validando o tipo do video id, que ele precisa ser um string e um uuid
    const paramsSchema = z.object({
        videoId: z.string().uuid()
    })

    // valida se req.params (parametros da requisição que seria o que vem na url no caso o id do video)
    // é do um objeto que segue o tipo do paramschema
    // e se estiver seguindo ele retorna o objeto com id do video
    const { videoId } = paramsSchema.parse(req.params)

    // validando o prompt para geração da transcrição do video
    const bodySchema = z.object({
        prompt: z.string(),
    })

    // caso estiver certo retorna o objeto com o prompt do video
    const { prompt } = bodySchema.parse(req.body)

    // buscando o arquivo de audio do video para fazer a transcrição
    const video = await prisma.video.findUniqueOrThrow({
        where:{
            id: videoId,
        }
    })

    // primeiro ele busca o video pegando ele pelo id 
    // e então pega o path desse video
    const videoPath = video.path

    // proximo passo ler o arquivo e envia-lo para api que fará a transcrição desse vídeo

    return{
        videoId, 
        prompt,
        videoPath
    }
  })
}