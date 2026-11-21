import { useEffect, useState } from 'react'
import '@/api'
import { eventTypesCreateEventType, eventTypesListEventTypes } from '@/client/sdk.gen'
import type { EventType } from '@/client/types.gen'
import { Button } from '@/components/ui/button'

type CatalogState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; eventTypes: EventType[] }

type FieldErrors = Partial<Record<'title' | 'description' | 'durationMinutes', string>>

const inputClass = 'border-input bg-background w-full rounded-md border px-3 py-2 text-sm'

export function AdminPage() {
  const [state, setState] = useState<CatalogState>({ status: 'loading' })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setFieldErrors({})
    const { data, error } = await eventTypesCreateEventType({
      body: { title, description, durationMinutes: Number(durationMinutes) },
    })
    setSubmitting(false)
    if (error || !data) {
      setFieldErrors(error?.error.details ?? {})
      return
    }
    setState((current) =>
      current.status === 'ready'
        ? { status: 'ready', eventTypes: [...current.eventTypes, data.eventType] }
        : current,
    )
    setTitle('')
    setDescription('')
    setDurationMinutes('')
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Страница владельца</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Типы встреч</h2>
        {state.status === 'loading' && <p>Загружаем типы встреч…</p>}
        {state.status === 'error' && (
          <p role="alert">Не удалось загрузить типы встреч. Попробуйте обновить страницу.</p>
        )}
        {state.status === 'ready' && state.eventTypes.length === 0 && (
          <p>Пока нет типов встреч.</p>
        )}
        {state.status === 'ready' && state.eventTypes.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {state.eventTypes.map((eventType) => (
              <li key={eventType.id} className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">{eventType.title}</h3>
                <p className="text-muted-foreground text-sm">{eventType.description}</p>
                <p className="mt-2 text-sm font-medium">{eventType.durationMinutes} мин</p>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="event-type-title" className="text-sm font-medium">
              Название
            </label>
            <input
              id="event-type-title"
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {fieldErrors.title && (
              <p role="alert" className="text-destructive text-sm">
                {fieldErrors.title}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="event-type-description" className="text-sm font-medium">
              Описание
            </label>
            <textarea
              id="event-type-description"
              className={inputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {fieldErrors.description && (
              <p role="alert" className="text-destructive text-sm">
                {fieldErrors.description}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="event-type-duration" className="text-sm font-medium">
              Длительность, мин
            </label>
            <input
              id="event-type-duration"
              type="number"
              min={1}
              max={540}
              className={inputClass}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
            {fieldErrors.durationMinutes && (
              <p role="alert" className="text-destructive text-sm">
                {fieldErrors.durationMinutes}
              </p>
            )}
          </div>
          <Button type="submit" disabled={submitting} className="self-start">
            Создать тип встречи
          </Button>
        </form>
      </section>
    </main>
  )
}
