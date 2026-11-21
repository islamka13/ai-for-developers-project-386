import { useEffect, useState } from 'react'
import '@/api'
import { eventTypesListEventTypes } from '@/client/sdk.gen'
import type { EventType } from '@/client/types.gen'
import { SlotCalendar } from './slot-calendar'

type CatalogState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; eventTypes: EventType[] }

export function BookingPage() {
  const [state, setState] = useState<CatalogState>({ status: 'loading' })
  const [selected, setSelected] = useState<EventType | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const { data, error } = await eventTypesListEventTypes()
      if (cancelled) return
      if (error || !data) {
        setState({ status: 'error' })
      } else {
        setState({ status: 'ready', eventTypes: data.eventTypes })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Страница записи</h1>
      <p className="text-muted-foreground">
        Выберите подходящий тип встречи и свободный слот.
      </p>
      {state.status === 'loading' && <p>Загружаем типы встреч…</p>}
      {state.status === 'error' && (
        <p role="alert">Не удалось загрузить типы встреч. Попробуйте обновить страницу.</p>
      )}
      {state.status === 'ready' && state.eventTypes.length === 0 && (
        <p>Пока нет доступных типов встреч.</p>
      )}
      {state.status === 'ready' && state.eventTypes.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {state.eventTypes.map((eventType) => (
            <li key={eventType.id}>
              <button
                type="button"
                aria-pressed={selected?.id === eventType.id}
                onClick={() => setSelected(eventType)}
                className={`w-full rounded-lg border p-4 text-left ${
                  selected?.id === eventType.id ? 'border-primary ring-2 ring-primary' : ''
                }`}
              >
                <h2 className="text-lg font-semibold">{eventType.title}</h2>
                <p className="text-muted-foreground text-sm">{eventType.description}</p>
                <p className="mt-2 text-sm font-medium">{eventType.durationMinutes} мин</p>
              </button>
            </li>
          ))}
        </ul>
      )}
      {selected && <SlotCalendar eventType={selected} />}
    </main>
  )
}
