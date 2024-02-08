import { fastify } from 'fastify'
import { getAllPromptsRoute } from './routes/get-all-prompts'
import { uploadVideo } from './routes/upload-video'
import { createTranscriptionRoute } from './routes/create-transcription'
import { generateAICompletionRoute } from './routes/generate-ai-completion'
import fastifyCors from '@fastify/cors'

const app = fastify()

// fastfy/cors serve para que o back-end só posssa ser acessado por alguns 
// fronts em específico, nesse caso está qualquer front end pode acessar o back
app.register(fastifyCors,{
    origin: '*'
})

//registrando a rota
app.register(getAllPromptsRoute)
app.register(uploadVideo)
app.register(createTranscriptionRoute)
app.register(generateAICompletionRoute)

app.listen({
    port: 3333
}).then(() => {
    console.log('HTTP server running!');
})

