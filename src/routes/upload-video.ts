import { fastifyMultipart } from "@fastify/multipart";
import { FastifyInstance } from "fastify";

import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs"
import { prisma } from "../lib/prisma";

// o pipeline serve para esperar todo o arquivo subir para armazena-lo em disco, usando o conceito de streams 
// por exemplo, enquanto o arquivo esta sendo lido ele já está sendo armazenados
// o promisify serve para que funções antigas do node que usam callback 
// sejam transformadas para funções que possam usar promisse (async, await)
const pump = promisify(pipeline)

export async function uploadVideo(app: FastifyInstance){
    app.register(fastifyMultipart, {
        limits:{
            //tamanho maximo do arquivo enviado
            fileSize: 1_048_576 * 25 // 25mb
        }
    })
    
    app.post('/videos', async (req, reply) => {
        const data = await req.file()

        // se não existir um data enviado
        if(!data){
            return reply.status(400).send({erro: 'Missing file input.'})
        }

        const extension = path.extname(data.filename)

        // iremos carregar um video porem foi colocado como mp3 pois 
        // a tratativa de transformar o video para audio sera feita no front 
        // então no back o vídeo já chegara como audio
        if(extension != '.mp3'){
            return reply.status(400).send({error: 'Invalid input type, please upload a MP3.'})
        }

        //retorna o nome do arquivo sem a extensão
        const fileBaseName = path.basename(data.filename, extension)

        // para que não hajam arquivos com o mesmo nome termos que criar um novo nome para esse arquivo
        // pega o nome base do arquivo primeiro já removando a extensão
        // então gera o nome desse arquivo como um id aleatório e por fim adicona a extensão a ele novamente 
        const fileUploadName = `${fileBaseName}-${randomUUID()}-${extension}`

        //onde o arquivo ficara armazenado
        // primeiro recupera onde este arquivo está, redireciona onde o arquivo vai ficar 
        // e por último passa qual sera o arquivo
        const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

        // aguarda a pipeline do upload do arquivo e então vai escrevendo esse arquivo no destino onde queremos salva-lo       
        await pump(data.file, fs.createWriteStream(uploadDestination))

        // fazendo a requisição para o banco de dadoss
        const video = await prisma.video.create({
            data:{
                name: data.filename,
                path: uploadDestination
            }
        })

        return {
            video
        }
    })
}


