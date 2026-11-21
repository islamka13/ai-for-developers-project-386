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

@route("/api/event-types")
namespace EventTypes {
  /** Список типов встреч. */
  @get
  op listEventTypes(): {
    @statusCode statusCode: 200;
    @body body: EventTypeList;
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
