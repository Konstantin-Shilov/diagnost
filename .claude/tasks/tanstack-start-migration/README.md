# Миграция на TanStack Start

## Цель миграции

Переход с текущего SPA (React + Vite + TanStack Router) на TanStack Start для получения:
- SSR для SEO (главная и about страницы)
- Type-safe server functions для backend API
- Единая кодовая база (frontend + backend)
- Минимальная миграция благодаря совместимости с TanStack Router

## Текущее состояние проекта

### Стек (обновлен 2026-01-10)
- **React 19.2.3** ⬆️ (было 19.1.1)
- **TypeScript 5.9.3** ⬆️ (было 5.9.2)
- **Vite 7.3.1** ⬆️ (было 7.2.2)
- **TanStack Router 1.146.2** ⬆️ (было 1.132.2)
- **Zustand 5.0.9** ⬆️ (было 5.0.8)
- **Zod 4.3.5** ⬆️ (было 4.1.11, ⚠️ beta, рекомендуется downgrade на v3.24.1)
- CSS Modules
- **jsPDF 4.0.0** ⬆️ (было 3.0.3, мажорное обновление!)
- **Vitest 4.0.16** ⬆️ (было 3.2.4, мажорное обновление!)

### Структура роутов
```
routes/
├── __root.tsx        # Root layout с MainLayout
├── index.tsx         # Главная страница (нужен SSR для SEO)
├── about.tsx         # О сервисе (нужен SSR для SEO)
├── survey.tsx        # Опросник (SPA режим)
├── history.tsx       # История результатов (требует auth)
└── results.$id.tsx   # Детальные результаты (требует auth)
```

### Хранение данных
- **localStorage** через Zustand persist:
  - `burnout-survey-state` - состояние опроса
  - `burnout-survey-results` - результаты диагностик

### Ключевые сервисы
- `analysisService.ts` - расчет скоринга и рекомендаций
- `pdfExportService.ts` - генерация PDF отчетов

### Deployment
- GitHub Pages (через `isGitHubPages` флаг)
- Basepath: `/diagnost/`

---

## ⚠️ ВАЖНО: Миграция в master ветке

**Данная миграция выполняется напрямую в ветке `main`**.

### Перед началом:
1. ✅ Закоммитить все текущие изменения
2. ✅ Убедиться что проект собирается: `npm run build`
3. ✅ Создать тег с текущей версией: `git tag pre-tanstack-start-migration`
4. ⚠️ Понимать, что изменения будут необратимы без revert

### Rollback план:
```bash
# Если что-то пойдет не так, вернуться к тегу
git reset --hard pre-tanstack-start-migration
npm install  # Восстановить зависимости
```

---

## План миграции

Миграция разбита на 5 фаз для поэтапного внедрения.

**Актуальные версии библиотек**: См. [@versions.md](./versions.md)

---

## Фаза 0: Подготовка (30 минут)

### Задачи

#### 0.1 Создать бэкап текущего состояния
```bash
# Закоммитить все изменения
git add .
git commit -m "Pre-migration: Save current state"

# Создать тег для возможного отката
git tag pre-tanstack-start-migration

# Убедиться что проект работает
npm run build
npm run dev  # Проверить что все работает
```

#### 0.2 Изучить документацию
- [ ] [TanStack Start Overview](https://tanstack.com/start/latest/docs/framework/react/overview)
- [ ] [TanStack Start Quick Start](https://tanstack.com/start/latest/docs/framework/react/quick-start)
- [ ] [Server Functions Guide](https://tanstack.com/start/latest/docs/framework/react/server-functions)
- [ ] [Migrating from Vinxi to Vite](https://blog.logrocket.com/migrating-tanstack-start-vinxi-vite/)

#### 0.3 Backend стек выбран
**✅ PostgreSQL + Prisma 7.2.0**
- Rust-free клиент (быстрее, меньше размер)
- Type-safe ORM
- Отличная интеграция с TanStack Start
- Поддержка миграций

#### 0.4 Схема базы данных
```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  diagnostics DiagnosticResult[]
}

model DiagnosticResult {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  timestamp       DateTime @default(now())
  responses       Json     // SurveyResponse[]
  totalScore      Int
  burnoutLevel    Json     // BurnoutLevel
  greenbergStage  Json     // GreenbergStage
  recommendations Json     // string[]
}
```

---

## Фаза 1: Установка и базовая настройка (1 день)

### ⚠️ ВАЖНО: TanStack Start теперь использует Vite (не Vinxi)

Начиная с v1.121.0, TanStack Start мигрировал с Vinxi на Vite.

### 1.1 Установить зависимости

```bash
# Core packages (Январь 2026)
npm install @tanstack/react-start@latest      # v1.145.3+
npm install @tanstack/react-query@latest      # v5.90.16+
npm install -D @tanstack/react-query-devtools@latest

# ⚠️ ВАЖНО: Downgrade Zod на стабильную версию!
# Текущая версия zod@4.3.5 это BETA версия
npm install zod@^3.24.1
```

**Актуальные версии** (см. [versions.md](./versions.md)):
- `@tanstack/react-start`: **1.145.3+** (нужно установить)
- `@tanstack/react-query`: **5.90.16+** (нужно установить)
- `zod`: **3.24.1** (стабильная, downgrade с 4.3.5)

**✅ Уже установлено и обновлено**:
- `react@19.2.3`, `react-dom@19.2.3` ✅
- `@tanstack/react-router@1.146.2` ✅
- `@tanstack/router-plugin@1.146.3` ✅
- `vite@7.3.1` ✅
- `typescript@5.9.3` ✅
- `@vitejs/plugin-react@5.1.2` ✅
- `zustand@5.0.9` ✅

**НЕ нужно**:
- ❌ `vinxi` (TanStack Start теперь на Vite)
- ❌ `@vinxi/react`
- ❌ `@tanstack/start` (устаревший пакет)

### 1.2 Обновить конфигурацию Vite

**Файл**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    // TanStack Start plugin вместо tanStackRouter
    tanstackStart({
      routesDirectory: './src/core/app/routing/routes',
      generatedRouteTree: './src/core/app/routing/routeTree.gen.ts',
    }),
    react(),
    tsconfigPaths(),
  ],
  server: {
    port: 9000,
    host: true,
  },
})
```

### 1.3 Обновить package.json scripts

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "start": "vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

### 1.4 Удалить устаревшие файлы

```bash
# Если есть app.config.ts - удалить (больше не нужен)
rm -f app.config.ts

# Если есть ssr.tsx или client.tsx в app/ - переименовать или удалить
# (вся конфигурация теперь в vite.config.ts)
```

### 1.5 Тестирование базовой настройки
- [ ] `npm run dev` запускается без ошибок
- [ ] Все роуты доступны
- [ ] HMR работает
- [ ] Build проходит успешно

---

## Фаза 2: Настройка базы данных (1-2 дня)

### 2.1 Установить Prisma 7.2.0

```bash
# Prisma 7.2.0 - последняя версия с Rust-free клиентом
npm install @prisma/client@latest   # v7.2.0
npm install -D prisma@latest        # v7.2.0

# Инициализация (создаст prisma/ директорию и .env)
npx prisma init
```

**Новое в Prisma 7**:
- Rust-free клиент по умолчанию (быстрее, меньше размер)
- Встроенная Prisma Studio в CLI
- SQL Comments support (v7.1.0)
- Возвращен флаг `--url` в CLI (v7.2.0)

### 2.2 Настроить схему БД

**Файл**: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String            @id @default(cuid())
  email           String            @unique
  name            String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  diagnosticResults DiagnosticResult[]
}

model DiagnosticResult {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  timestamp       DateTime @default(now())

  // JSON поля для хранения сложных структур
  responses       Json     // SurveyResponse[]
  totalScore      Int
  maxTotalScore   Int
  burnoutLevel    Json     // BurnoutLevel
  greenbergStage  Json     // GreenbergStage
  recommendations Json     // string[]

  @@index([userId, timestamp])
}
```

### 2.3 Создать DATABASE_URL

**Файл**: `.env` (не коммитить!)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/diagnost_dev"
```

Для production (Vercel):
- Создать PostgreSQL на [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) или [Neon](https://neon.tech)
- Добавить `DATABASE_URL` в environment variables

### 2.4 Запустить миграции

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 2.5 Создать Prisma client singleton

**Файл**: `src/server/db/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

## Фаза 3: Создание Server Functions (2-3 дня)

### 3.1 Структура server директории

```
src/server/
├── db/
│   └── prisma.ts
├── auth/
│   ├── session.ts
│   └── middleware.ts
└── functions/
    ├── diagnostics.ts
    └── auth.ts
```

### 3.2 Реализовать auth server functions

**Файл**: `src/server/functions/auth.ts`

```typescript
import { createServerFn } from '@tanstack/start'
import { z } from 'zod'
import { prisma } from '../db/prisma'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const login = createServerFn('POST')
  .validator(loginSchema)
  .handler(async ({ data, context }) => {
    // TODO: Реализовать проверку пароля (bcrypt)
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // TODO: Создать сессию
    return { user }
  })

export const signup = createServerFn('POST')
  .validator(loginSchema)
  .handler(async ({ data }) => {
    // TODO: Хешировать пароль
    const user = await prisma.user.create({
      data: {
        email: data.email,
        // password: hashedPassword,
      },
    })

    return { user }
  })

export const getCurrentUser = createServerFn('GET')
  .handler(async ({ context }) => {
    // TODO: Получить user из сессии
    const userId = context.session?.userId

    if (!userId) {
      return null
    }

    return await prisma.user.findUnique({
      where: { id: userId },
    })
  })
```

### 3.3 Реализовать diagnostics server functions

**Файл**: `src/server/functions/diagnostics.ts`

```typescript
import { createServerFn } from '@tanstack/start'
import { z } from 'zod'
import { prisma } from '../db/prisma'
import type { DiagnosticResult } from '@/core/types'

const diagnosticSchema = z.object({
  responses: z.array(z.any()), // TODO: добавить точную типизацию
  totalScore: z.number(),
  maxTotalScore: z.number(),
  burnoutLevel: z.object({
    level: z.enum(['low', 'moderate', 'high', 'severe', 'critical']),
    score: z.number(),
    maxScore: z.number(),
    percentage: z.number(),
    description: z.string(),
  }),
  greenbergStage: z.any(),
  recommendations: z.array(z.string()),
})

// Получить все диагностики пользователя
export const getUserDiagnostics = createServerFn('GET')
  .handler(async ({ context }) => {
    const userId = context.session?.userId

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const results = await prisma.diagnosticResult.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    })

    return results.map(r => ({
      id: r.id,
      timestamp: r.timestamp,
      responses: r.responses,
      totalScore: r.totalScore,
      maxTotalScore: r.maxTotalScore,
      burnoutLevel: r.burnoutLevel,
      greenbergStage: r.greenbergStage,
      recommendations: r.recommendations,
    })) as DiagnosticResult[]
  })

// Получить одну диагностику
export const getDiagnostic = createServerFn('GET')
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const userId = context.session?.userId

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const result = await prisma.diagnosticResult.findFirst({
      where: {
        id: data.id,
        userId, // Проверка что результат принадлежит пользователю
      },
    })

    if (!result) {
      throw new Error('Diagnostic not found')
    }

    return result as unknown as DiagnosticResult
  })

// Сохранить новую диагностику
export const saveDiagnostic = createServerFn('POST')
  .validator(diagnosticSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session?.userId

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const result = await prisma.diagnosticResult.create({
      data: {
        userId,
        totalScore: data.totalScore,
        maxTotalScore: data.maxTotalScore,
        responses: data.responses as any,
        burnoutLevel: data.burnoutLevel as any,
        greenbergStage: data.greenbergStage as any,
        recommendations: data.recommendations as any,
      },
    })

    return result as unknown as DiagnosticResult
  })

// Удалить диагностику
export const deleteDiagnostic = createServerFn('DELETE')
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const userId = context.session?.userId

    if (!userId) {
      throw new Error('Unauthorized')
    }

    await prisma.diagnosticResult.deleteMany({
      where: {
        id: data.id,
        userId, // Убедиться что удаляем только свои результаты
      },
    })

    return { success: true }
  })
```

### 3.4 Тестирование server functions
- [ ] Создать тестовые вызовы функций
- [ ] Проверить валидацию схем
- [ ] Проверить error handling

---

## Фаза 4: Миграция Store на Server Functions (2 дня)

### 4.1 Обновить resultsStore

**Было** (localStorage):
```typescript
export const useResultsStore = create<ResultsStore>()(
  persist(
    (set, get) => ({
      results: [],
      saveResult: (result) => {
        set({ results: [...get().results, result] })
      },
      // ...
    }),
    { name: 'burnout-survey-results' }
  )
)
```

**Стало** (server functions):

**Файл**: `src/core/store/resultsStore.ts`

```typescript
import { create } from 'zustand'
import {
  getUserDiagnostics,
  saveDiagnostic,
  deleteDiagnostic
} from '@/server/functions/diagnostics'
import type { DiagnosticResult } from '@/core/types'

interface ResultsStore {
  results: DiagnosticResult[]
  currentResult: DiagnosticResult | null
  isLoading: boolean
  error: string | null

  // Actions
  loadResults: () => Promise<void>
  saveResult: (result: DiagnosticResult) => Promise<void>
  deleteResult: (id: string) => Promise<void>
  setCurrentResult: (result: DiagnosticResult | null) => void
}

export const useResultsStore = create<ResultsStore>((set, get) => ({
  results: [],
  currentResult: null,
  isLoading: false,
  error: null,

  loadResults: async () => {
    set({ isLoading: true, error: null })
    try {
      const results = await getUserDiagnostics()
      set({ results, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      })
    }
  },

  saveResult: async (result) => {
    set({ isLoading: true, error: null })
    try {
      const saved = await saveDiagnostic({ data: result })
      set(state => ({
        results: [...state.results, saved],
        isLoading: false
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      })
      throw error
    }
  },

  deleteResult: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await deleteDiagnostic({ data: { id } })
      set(state => ({
        results: state.results.filter(r => r.id !== id),
        currentResult: state.currentResult?.id === id ? null : state.currentResult,
        isLoading: false
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      })
      throw error
    }
  },

  setCurrentResult: (result) => {
    set({ currentResult: result })
  },
}))
```

### 4.2 Обновить компоненты

**Пример**: `src/routes/history.tsx`

**Было**:
```typescript
function HistoryPage() {
  const { results } = useResultsStore()

  return <div>{results.map(...)}</div>
}
```

**Стало**:
```typescript
import { createFileRoute } from '@tanstack/react-router'
import { getUserDiagnostics } from '@/server/functions/diagnostics'

export const Route = createFileRoute('/history')({
  loader: async () => {
    // Загружаем данные на сервере при SSR
    return await getUserDiagnostics()
  },
  component: HistoryPage,
})

function HistoryPage() {
  const diagnostics = Route.useLoaderData()

  return <div>{diagnostics.map(...)}</div>
}
```

### 4.3 Миграция surveyStore

Survey store можно оставить с localStorage (временное состояние опроса не требует БД).

**Опционально**: Можно добавить auto-save в БД как черновик.

---

## Фаза 5: Настройка SSR для SEO (1 день)

### 5.1 Настроить meta tags для роутов

**Файл**: `src/routes/index.tsx`

```typescript
export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'Диагностика эмоционального выгорания | Тест Маслач',
        description: 'Пройдите научно обоснованный тест на выгорание (MBI). Получите детальный анализ по модели Гринберга и персональные рекомендации.',
      },
      {
        property: 'og:title',
        content: 'Диагностика эмоционального выгорания',
      },
      {
        property: 'og:description',
        content: 'Пройдите научно обоснованный тест на выгорание и получите персональные рекомендации',
      },
    ],
  }),
  component: HomePage,
})
```

### 5.2 Настроить render modes

**Файл**: `src/routes/__root.tsx`

```typescript
export const Route = createRootRoute({
  // SSR по умолчанию
  meta: { renderMode: 'ssr' },

  component: RootLayout,
})
```

**SPA режим для приватных страниц**:

```typescript
// src/routes/survey.tsx
export const Route = createFileRoute('/survey')({
  meta: { renderMode: 'spa' }, // Client-side only
  component: SurveyPage,
})
```

### 5.3 Настроить sitemap.xml

**Файл**: `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/about</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## Фаза 6: Развертывание (1 день)

### 6.1 Настроить Vercel

**Файл**: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output",
  "framework": "vite",
  "regions": ["fra1"]
}
```

### 6.2 Environment Variables на Vercel

Добавить в Vercel Dashboard:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - для подписи сессий

### 6.3 Deployment

```bash
# Установить Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 6.4 Проверить production
- [ ] SSR работает (View Page Source показывает контент)
- [ ] Server functions работают
- [ ] БД доступна
- [ ] Auth работает

---

## Миграция данных из localStorage

### Скрипт экспорта данных

**Файл**: `src/utils/migrateLocalStorage.ts`

```typescript
export function exportLocalStorageData() {
  const surveyResults = localStorage.getItem('burnout-survey-results')

  if (surveyResults) {
    const data = JSON.parse(surveyResults)

    // Скачать как JSON файл
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `burnout-results-export-${Date.now()}.json`
    a.click()
  }
}
```

### Импорт в БД

После создания аккаунта пользователь может импортировать старые результаты через UI.

---

## Риски и митигация

### Риск 1: Breaking changes в TanStack Start
**Митигация**:
- Следить за changelog
- Закрепить версии зависимостей
- Регулярно обновлять

### Риск 2: Проблемы с SSR (window is not defined)
**Митигация**:
- Использовать `typeof window !== 'undefined'` checks
- Переместить browser-only код в useEffect
- Использовать dynamic imports для client-only кода

### Риск 3: Производительность БД
**Митигация**:
- Добавить индексы в Prisma schema
- Использовать pagination для списков
- Connection pooling

### Риск 4: Потеря данных пользователей
**Митигация**:
- Создать инструмент экспорта/импорта
- Сохранить localStorage как fallback
- Уведомить пользователей заранее

---

## Rollback план

⚠️ **Важно**: Так как миграция выполняется в master ветке, откат требует жесткого reset к тегу.

### Полный откат к pre-migration состоянию

```bash
# Вернуться к тегу pre-tanstack-start-migration
git reset --hard pre-tanstack-start-migration

# Восстановить зависимости
npm install

# Проверить что все работает
npm run build
npm run dev
```

### Частичный откат (только package.json)

Если нужно откатить только зависимости:

```bash
# Откатить package.json и package-lock.json
git checkout pre-tanstack-start-migration -- package.json package-lock.json

# Переустановить зависимости
npm install

# Закоммитить откат
git add package.json package-lock.json
git commit -m "Rollback: Revert dependencies to pre-migration state"
```

### Удаление тега после успешной миграции

```bash
# После успешной миграции можно удалить тег
git tag -d pre-tanstack-start-migration
```

---

## Чеклист готовности

### До начала миграции
- [ ] Все тесты проходят
- [ ] Код закоммичен
- [ ] Создан backup ветки
- [ ] Команда ознакомлена с планом

### После миграции
- [ ] Все роуты работают
- [ ] SSR работает для публичных страниц
- [ ] Server functions работают
- [ ] Auth работает
- [ ] БД работает
- [ ] Production deployment успешен
- [ ] Мониторинг настроен
- [ ] Документация обновлена

---

## Следующие шаги после миграции

1. **Добавить email уведомления** (Resend/SendGrid)
2. **Реализовать сравнение результатов** во времени
3. **Добавить AI рекомендации** (OpenAI API)
4. **Создать dashboard с графиками** (Recharts)
5. **Добавить экспорт в Word/Excel**

---

## Полезные ссылки

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Prisma Docs](https://www.prisma.io/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [TanStack Router SSR](https://tanstack.com/router/latest/docs/framework/react/guide/ssr)

---

## Контакты для помощи

- TanStack Discord: https://discord.com/invite/WrRKjPJ
- Prisma Discord: https://discord.gg/prisma

---

**Дата создания**: 2025-12-14
**Последнее обновление**: 2026-01-10
**Автор**: Konstantin Shylov (с помощью Claude Code)
**Версия**: 2.0 (обновлено под master ветку + актуальные версии библиотек)