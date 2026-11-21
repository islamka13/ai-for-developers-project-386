import { Button } from '@/components/ui/button'

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Запись на звонок</h1>
      <p className="max-w-xl text-muted-foreground">
        Сервис бронирования времени: выберите тип встречи и свободный слот в календаре на ближайшие
        14 дней.
      </p>
      <Button asChild size="lg">
        <a href="/booking">Записаться</a>
      </Button>
    </main>
  )
}

export default App
