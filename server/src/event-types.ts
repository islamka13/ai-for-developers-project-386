import type { EventType } from './generated/schemas/eventType.ts'

/**
 * In-memory репозиторий типов встреч.
 * Хранение не переживает перезапуск (ограничение из README.md).
 */
export interface EventTypeRepository {
  list(): EventType[]
}

export function createEventTypeRepository(seed: EventType[]): EventTypeRepository {
  const eventTypes = [...seed]
  return {
    list: () => [...eventTypes],
  }
}

/** Сид при старте: базовые типы встреч, чтобы запись работала без настройки. */
export const seedEventTypes: EventType[] = [
  {
    id: 1,
    title: 'Знакомство',
    description: 'Короткая встреча, чтобы познакомиться и обсудить запрос.',
    durationMinutes: 30,
  },
  {
    id: 2,
    title: 'Консультация',
    description: 'Развёрнутая консультация по вашему вопросу.',
    durationMinutes: 60,
  },
]

export const eventTypeRepository = createEventTypeRepository(seedEventTypes)
