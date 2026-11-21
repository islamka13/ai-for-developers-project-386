import { existsSync } from 'node:fs'
import path from 'node:path'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

const distDir = path.resolve(process.cwd(), 'web/dist')

export const app = new Hono()

app.get('/api/health', (c) => c.json({ status: 'ok' }))

// В продакшене сервер раздаёт собранный фронтенд из web/dist.
// В dev-режиме фронтенд обслуживает Vite, а эти обработчики просто не подключаются.
if (existsSync(distDir)) {
  app.use('/*', serveStatic({ root: distDir }))
  app.get('*', (c, next) => {
    if (c.req.path.startsWith('/api/')) {
      return next()
    }
    return serveStatic({ path: path.join(distDir, 'index.html') })(c, next)
  })
}
