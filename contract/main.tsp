import "@typespec/http";

using Http;

@service(#{ title: "Запись на звонок API" })
@server("http://localhost:3000", "dev server")
namespace Api;

/** Тип встречи: название, описание и длительность в минутах. */
model EventType {
  id: int32;

  @minLength(1)
  title: string;

  description: string;

  @minValue(1)
  @maxValue(540)
  durationMinutes: int32;
}

/** Каталог типов встреч. */
model EventTypeList {
  eventTypes: EventType[];
}

/** Ошибка API в единой форме. */
model ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/** Свободные старты слотов на дату (ISO 8601 с offset зоны владельца). */
model SlotList {
  slots: string[];
}

@route("/api/event-types")
namespace EventTypes {
  /** Список типов встреч. */
  @get
  op listEventTypes(): {
    @statusCode statusCode: 200;
    @body body: EventTypeList;
  };

  /** Свободные слоты типа встречи на дату (дата в зоне владельца). */
  @route("/{id}/slots")
  @get
  op listSlots(
    @path id: string,
    /** Дата в формате YYYY-MM-DD (зона владельца). */
    @query date: plainDate,
  ): {
    @statusCode statusCode: 200;
    @body body: SlotList;
  } | {
    @statusCode statusCode: 404;
    @body body: ApiError;
  };
}

@route("/api/health")
namespace Health {
  /** Проверка живости сервиса. */
  @get
  op check(): {
    @statusCode statusCode: 200;
    @body body: { status: string };
  };
}
