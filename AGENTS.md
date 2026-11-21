# AGENTS.md

Рабочие правила проекта для ИИ-агентов.

## Команды

Все инструменты и задачи управляются через [mise](https://mise.jdx.dev/) (версии зафиксированы в `mise.toml`):

- `mise install` — установить инструменты (Node.js, hk)
- `mise run install` — установить npm-зависимости
- `mise run dev` — запустить dev-серверы (бекенд :3000, фронтенд :5173, прокси `/api` → :3000)
- `mise run build` — собрать фронтенд (`web/dist`) и проверить типы бекенда
- `mise run check` — **все проверки**: линтер (oxlint) + типы (tsc) + тесты (Vitest). Та же команда запускается в CI
- `npm run start -w server` — продакшен-запуск (`node server/src/index.ts`, порт из `PORT`, раздаёт `web/dist`)

Git-хуки через [hk](https://hk.jdx.dev/) (`hk install` после клонирования): pre-commit запускает lint, typecheck и test — те же проверки, что и `mise run check`.

## Устройство проекта

Монорепозиторий (npm workspaces):

- `server/` — бекенд на Hono (TypeScript, нативный запуск .ts в Node 26). Вход: `src/index.ts`, приложение: `src/app.ts`. Тесты: `test/`
- `web/` — фронтенд: Vite 8 + React 19 + Tailwind CSS 4 + shadcn/ui (алиас `@/` → `web/src`, компоненты в `src/components/ui`)
- `.github/workflows/ci.yml` — наш CI (прогон `mise run check`)
- `.github/workflows/hexlet-check.yml` — автопроверка Хекслета, **не редактировать и не удалять**

## Agent skills

Скиллы установлены в `.agents/skills/` (набор [mattpocock/skills](https://github.com/mattpocock/skills)). Вызов — просьбой по имени («Запусти скилл wayfinder») или ссылкой на файл `@.agents/skills/<имя>/SKILL.md`.

### Issue tracker

Задачи и спецификации живут в GitHub Issues этого репозитория, операции через `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Пять канонических меток: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` в корне, решения в `docs/adr/` (создаются лениво скиллами). See `docs/agents/domain.md`.

## Правила

- **Коммиты по Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:` и т.д.
- Перед коммитом все проверки должны быть зелёными (`mise run check`).
- Секреты и ключи — только через переменные окружения, в Git не коммитим.
