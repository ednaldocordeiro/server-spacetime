import axios from 'axios'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { getSecretsVariables } from '../utils/getRegisterMethod'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (req, res) => {
    console.log(req.headers)
    const bodySchema = z.object({
      code: z.string(),
      type: z.string(),
    })

    const { code, type } = bodySchema.parse(req.body)

    const { client_id, client_secret } = getSecretsVariables(type)

    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          code,
          client_id,
          client_secret,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    )
    console.log(accessTokenResponse)

    const { access_token } = accessTokenResponse.data

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    })

    const userInfo = userSchema.parse(userResponse.data)

    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id,
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        },
      })
    }

    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: '30 days',
      },
    )

    return {
      token,
    }
  })
}
