import { fastify } from 'fastify'
import { getAllPromptsRoute } from './routes/get-all-prompts'

const app = fastify()

//registrando a rota
app.register(getAllPromptsRoute)

app.listen({
    port: 3333
}).then(() => {
    console.log('HTTP server running!');
})