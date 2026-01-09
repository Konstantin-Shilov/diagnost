# Разработка и развертывание

## Команды разработки

```bash
# Разработка
npm run dev              # Запуск dev-сервера

# Сборка
npm run build           # Production сборка
npm run build:gh-pages  # Сборка для GitHub Pages

# Проверка кода
npm run check           # Biome lint + format check
npm run check:format    # Исправить форматирование
npm run typecheck       # TypeScript проверка типов

# Тестирование
npm test                # Запуск Vitest тестов
```

## Правила коммитов

Используется Husky для pre-commit hooks:
- Автоматическая проверка форматирования (Biome)
- Type checking перед коммитом
- Линтинг измененных файлов

## Deployment

Проект настроен для развертывания на GitHub Pages:
- Base path конфигурируется через `isGitHubPages` флаг
- Build оптимизирован для production
- SRI (Subresource Integrity) включен через vite-plugin-sri