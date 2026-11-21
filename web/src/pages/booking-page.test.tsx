import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BookingPage } from './booking-page'

function stubFetch(body: unknown, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      ok
        ? new Response(JSON.stringify(body), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        : new Response('Internal Server Error', { status: 500 }),
    ),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Страница записи: каталог типов встреч', () => {
  it('показывает типы встреч, загруженные через SDK', async () => {
    stubFetch({
      eventTypes: [
        { id: 1, title: 'Знакомство', description: 'Короткая встреча', durationMinutes: 30 },
        { id: 2, title: 'Консультация', description: 'Развёрнутая консультация', durationMinutes: 60 },
      ],
    })

    render(<BookingPage />)

    expect(screen.getByText('Загружаем типы встреч…')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Знакомство' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Консультация' })).toBeInTheDocument()
    expect(screen.getByText('30 мин')).toBeInTheDocument()
    expect(screen.getByText('60 мин')).toBeInTheDocument()
  })

  it('показывает ошибку, если каталог не загрузился', async () => {
    stubFetch(null, false)

    render(<BookingPage />)

    expect(
      await screen.findByText('Не удалось загрузить типы встреч. Попробуйте обновить страницу.'),
    ).toBeInTheDocument()
  })

  it('показывает пустое состояние, когда типов встреч нет', async () => {
    stubFetch({ eventTypes: [] })

    render(<BookingPage />)

    expect(await screen.findByText('Пока нет доступных типов встреч.')).toBeInTheDocument()
  })
})
