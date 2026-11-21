/**
 * Бронирование: слот, занятый гостем.
 */
export interface Booking {
  id: string
  eventTypeId: string
  start: Date
  durationMinutes: number
  guestName: string
}

/**
 * In-memory репозиторий бронирований.
 * Хранение не переживает перезапуск (ограничение из README.md).
 */
export interface BookingRepository {
  list(): Booking[]
  add(booking: Booking): void
}

export function createBookingRepository(seed: Booking[] = []): BookingRepository {
  const bookings = [...seed]
  return {
    list: () => [...bookings],
    add: (booking) => {
      bookings.push(booking)
    },
  }
}

export const bookingRepository = createBookingRepository()
