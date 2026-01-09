# Архитектура проекта

## Структура проекта

```
src/
├── common/                      # Общие переиспользуемые компоненты
│   └── shared/
│       └── ui/
│           └── NotFound/       # 404 страница
├── components/                  # Основные компоненты приложения
│   ├── BurgerButton/           # Мобильное меню (бургер)
│   ├── Button/                 # Универсальная кнопка (link/button)
│   ├── Header/                 # Шапка сайта с навигацией
│   ├── Results/                # Компоненты результатов диагностики
│   ├── Survey/                 # Компоненты опросника
│   │   ├── ProgressBar.tsx    # Прогресс-бар
│   │   ├── ScaleQuestion.tsx  # Вопрос со шкалой
│   │   └── SurveyContainer.tsx
│   └── Typography/             # Типографика (Text, Title)
├── core/                       # Ядро приложения
│   ├── app/                    # Конфигурация приложения
│   │   ├── index.tsx          # Точка входа
│   │   └── routing/           # Роутинг
│   │       ├── router.tsx
│   │       ├── routeTree.gen.ts
│   │       └── routes/        # Файловый роутинг
│   │           ├── __root.tsx
│   │           ├── index.tsx  # Главная страница
│   │           ├── about.tsx  # О сервисе
│   │           ├── survey.tsx # Опросник
│   │           ├── history.tsx # История результатов
│   │           └── results.$id.tsx # Результаты по ID
│   ├── data/                   # Конфигурация данных
│   │   └── surveyConfig.ts    # Вопросы, шкалы, правила скоринга
│   ├── layout/                 # Лейауты
│   │   └── MainLayout/
│   ├── services/              # Бизнес-логика
│   │   ├── analysisService.ts # Анализ и подсчет результатов
│   │   ├── pdfExportService.ts # Экспорт в PDF
│   │   └── fonts/             # Шрифты для PDF
│   ├── store/                 # Zustand стор
│   │   ├── surveyStore.ts    # Состояние опроса
│   │   └── resultsStore.ts   # Результаты диагностик
│   └── types/                 # TypeScript типы
│       ├── index.ts
│       ├── storage.ts
│       └── survey.ts
└── index.tsx                  # Рендер React приложения
```

## Архитектурные принципы

### 1. Файловый роутинг (TanStack Router)
- Маршруты определяются структурой папок в `src/core/app/routing/routes/`
- Автогенерация типов для type-safe навигации
- Параметры роута типизированы (например, `results.$id.tsx`)

### 2. Feature-Sliced Design элементы
- Разделение на `common` (переиспользуемое) и `components` (фичи)
- Сервисы изолированы в `core/services`
- Единый стор в `core/store`

### 3. Изоляция стилей
- CSS Modules для каждого компонента
- Файлы стилей рядом с компонентами: `Component.tsx` + `Component.module.css`
- Mobile-first подход с медиа-запросами `@media (max-width: 640px)`

### 4. Type Safety
- Строгая типизация через TypeScript
- Zod схемы для валидации
- Типизированные стор и роуты