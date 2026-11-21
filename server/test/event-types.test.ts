import path from 'node:path'
import SwaggerParser from '@apidevtools/swagger-parser'
import AjvModule from 'ajv'
import addFormatsModule from 'ajv-formats'
import { beforeAll, describe, expect, it } from 'vitest'
import { app } from '../src/app.ts'

// CJS-пакеты под verbatimModuleSyntax: default-экспорт лежит в `.default`.
const Ajv = AjvModule.default
const addFormats = addFormatsModule.default

const SPEC_PATH = path.resolve(__dirname, '../../contract/openapi.yaml')

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let spec: any

beforeAll(async () => {
  spec = await SwaggerParser.dereference(SPEC_PATH)
})

/** Валидатор тела ответа; падает, если путь или код не описаны в контракте. */
function responseValidator(routePath: string, method: string, status: number) {
  const operation = spec.paths[routePath]?.[method]
  if (!operation) throw new Error(`${method.toUpperCase()} ${routePath} не описан в контракте`)
  const response =
    operation.responses?.[status] ??
    operation.responses?.[`${String(status)[0]}XX`] ??
    operation.responses?.default
  if (!response) throw new Error(`Код ${status} не описан для ${method.toUpperCase()} ${routePath}`)
  const schema = response.content?.['application/json']?.schema
  return schema ? ajv.compile(schema) : null
}

describe('GET /api/event-types', () => {
  it('отвечает 200 с сид-типами встреч', async () => {
    const response = await app.request('/api/event-types')

    expect(response.status).toBe(200)
    const body = (await response.json()) as { eventTypes: unknown[] }
    expect(body.eventTypes).toEqual([
      { id: 1, title: 'Знакомство', description: expect.any(String), durationMinutes: 30 },
      { id: 2, title: 'Консультация', description: expect.any(String), durationMinutes: 60 },
    ])
  })

  it('ответ соответствует схеме из openapi.yaml', async () => {
    const response = await app.request('/api/event-types')

    expect(response.status).toBe(200)
    const validate = responseValidator('/api/event-types', 'get', 200)
    const body = await response.json()
    expect(validate?.(body) ?? true, ajv.errorsText(validate?.errors)).toBe(true)
  })
})

describe('GET /api/health', () => {
  it('ответ соответствует схеме из openapi.yaml', async () => {
    const response = await app.request('/api/health')

    expect(response.status).toBe(200)
    const validate = responseValidator('/api/health', 'get', 200)
    const body = await response.json()
    expect(validate?.(body) ?? true, ajv.errorsText(validate?.errors)).toBe(true)
  })
})
