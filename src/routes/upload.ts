import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { createWriteStream } from 'fs'
import { extname, resolve } from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (req, res) => {
    const upload = await req.file({
      limits: {
        fileSize: 5_242_880, // 5MB
      },
    })

    if (!upload) {
      return res.status(400).send()
    }

    const mimeTypeRegex = /(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return res.status(400).send()
    }

    const fileId = randomUUID()
    const extensionFile = extname(upload.filename)

    const filename = fileId.concat(extensionFile)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads', filename),
    )

    // Amazon S3, Google GCS
    await pump(upload.file, writeStream)

    const fullUrl = req.protocol.concat('://').concat(req.hostname) // hostname === endereço da minha aplicação
    const fileUrl = new URL(`/uploads/${filename}`, fullUrl).toString()

    return { fileUrl }
  })
}
