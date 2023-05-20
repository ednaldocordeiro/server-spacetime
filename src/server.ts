import 'dotenv/config'

import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastify from 'fastify'

import { resolve } from 'path'
import { authRoutes } from './routes/auth'
import { memoriesRoutes } from './routes/memories'
import { uploadRoutes } from './routes/upload'

const app = fastify()

app.register(multipart)
app.register(require('@fastify/static'), {
  // deixa publico para acessar
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})
app.register(cors, {
  origin: true, // todas URLs de front-end poderão acessar a API
})
app.register(jwt, {
  secret: 'spacetime', // não deve ser simples assim (qkushjd498fgh43bweuiryfgwolhbvhqb8f7qu4ryt])
})

app.register(authRoutes)
app.register(memoriesRoutes)
app.register(uploadRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Server is running on http://localhost:3333')
  })
