import "@typespec/http";

using Http;

@service(#{ title: "Запись на звонок API" })
@server("http://localhost:3000", "dev server")
namespace Api;

/** Тип встречи: название, описание и длительность в минутах. */
model EventType {
  /** Идентификатор генерирует сервер. */
  id: string;

  @minLength(1)
  title: string;

  description: string;

  @minValue(1)
  @maxValue(540)
  durationMinutes: int32;
}

/** Данные для создания типа встречи владельцем. */
model CreateEventType {
  @minLength(1)
  title: string;

  @minLength(1)
  description: string;

  @minValue(1)
  @maxValue(540)
  durationMinutes: int32;
}

/** Созданный тип встречи. */
model CreatedEventType {
  eventType: EventType;
}

/** Каталог типов встреч. */
model EventTypeList {
  eventTypes: EventType[];
}

/** Единая форма ошибки: код, сообщение и необязательные детали по полям. */
model ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string>;
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

  /** Создать тип встречи (владелец). */
  @post
  op createEventType(@body body: CreateEventType):
    | {
        @statusCode statusCode: 201;
        @body body: CreatedEventType;
      }
    | {
        @statusCode statusCode: 400;
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
