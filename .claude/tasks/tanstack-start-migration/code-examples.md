# Примеры кода для миграции

## Конфигурационные файлы

### ⚠️ ВАЖНО: app.config.ts больше НЕ используется

TanStack Start с версии v1.121.0 перешел с Vinxi на Vite. Файл `app.config.ts` больше не нужен.

### vite.config.ts (обновленный)

```typescript
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    // TanStack Start plugin заменяет tanStackRouter
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

**Примечание**: Теперь используется стандартный Vite config вместо TanStack Start config.

---

## Server Functions

### Базовый пример

```typescript
import { createServerFn } from '@tanstack/start'
import { z } from 'zod'

// GET запрос без параметров
export const getHello = createServerFn('GET')
  .handler(async () => {
    return { message: 'Hello from server!' }
  })

// POST с валидацией
export const createItem = createServerFn('POST')
  .validator(z.object({
    name: z.string(),
    description: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    // data типизирована!
    return { id: '123', name: data.name }
  })
```

### С контекстом (auth)

```typescript
export const getProtectedData = createServerFn('GET')
  .handler(async ({ context }) => {
    // Получаем userId из сессии
    const userId = context.session?.userId

    if (!userId) {
      throw new Error('Unauthorized')
    }

    return await db.getData(userId)
  })
```

### Error handling

```typescript
export const riskyOperation = createServerFn('POST')
  .validator(mySchema)
  .handler(async ({ data }) => {
    try {
      return await doSomething(data)
    } catch (error) {
      // Логирование
      console.error('Operation failed:', error)

      // Отправка в Sentry/etc
      // captureException(error)

      throw new Error('Operation failed')
    }
  })
```

---

## Использование Server Functions в компонентах

### В loader (SSR)

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { getDiagnostics } from '@/server/functions/diagnostics'

export const Route = createFileRoute('/history')({
  loader: async () => {
    // Выполняется на сервере при SSR
    // Выполняется на клиенте при navigation
    return await getDiagnostics()
  },
  component: HistoryPage,
})

function HistoryPage() {
  const data = Route.useLoaderData()

  return <div>{data.map(...)}</div>
}
```

### В компоненте (client-side)

```typescript
import { saveDiagnostic } from '@/server/functions/diagnostics'
import { useState } from 'react'

function SaveButton({ result }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await saveDiagnostic({ data: result })
      alert('Saved!')
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handleSave} disabled={isLoading}>
      {isLoading ? 'Saving...' : 'Save'}
    </button>
  )
}
```

### С React Query (рекомендуется)

```typescript
import { useMutation, useQuery } from '@tanstack/react-query'
import { getDiagnostics, saveDiagnostic } from '@/server/functions/diagnostics'

function HistoryPage() {
  // Автоматический refetch, кеширование, и т.д.
  const { data, isLoading } = useQuery({
    queryKey: ['diagnostics'],
    queryFn: () => getDiagnostics(),
  })

  const saveMutation = useMutation({
    mutationFn: saveDiagnostic,
    onSuccess: () => {
      // Инвалидация кеша
      queryClient.invalidateQueries({ queryKey: ['diagnostics'] })
    },
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {data?.map(...)}
      <button onClick={() => saveMutation.mutate(result)}>
        Save
      </button>
    </div>
  )
}
```

---

## Prisma примеры

### Базовые операции

```typescript
import { prisma } from '@/server/db/prisma'

// Create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
})

// Read
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
})

const users = await prisma.user.findMany({
  where: {
    createdAt: {
      gte: new Date('2024-01-01'),
    },
  },
  orderBy: { createdAt: 'desc' },
  take: 10, // Limit
})

// Update
const updated = await prisma.user.update({
  where: { id: '123' },
  data: { name: 'Jane Doe' },
})

// Delete
await prisma.user.delete({
  where: { id: '123' },
})
```

### Relations

```typescript
// Create с relation
const diagnostic = await prisma.diagnosticResult.create({
  data: {
    userId: '123',
    totalScore: 15,
    responses: { /* JSON */ },
    // ...
  },
  include: {
    user: true, // Включить user в результат
  },
})

// Query с relations
const userWithDiagnostics = await prisma.user.findUnique({
  where: { id: '123' },
  include: {
    diagnosticResults: {
      orderBy: { timestamp: 'desc' },
      take: 5, // Последние 5 результатов
    },
  },
})
```

### Transactions

```typescript
// Если нужно выполнить несколько операций атомарно
const [user, diagnostic] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'test@example.com' } }),
  prisma.diagnosticResult.create({ data: { /* ... */ } }),
])

// Или интерактивная транзакция
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { /* ... */ } })
  await tx.diagnosticResult.create({
    data: {
      userId: user.id,
      // ...
    },
  })
})
```

---

## SSR Meta Tags

### Статичные meta tags

```typescript
export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      {
        title: 'О сервисе | Диагностика выгорания',
        description: 'Научно обоснованный подход к диагностике эмоционального выгорания',
      },
      {
        name: 'keywords',
        content: 'выгорание, диагностика, тест Маслач, модель Гринберга',
      },
      {
        property: 'og:title',
        content: 'О сервисе диагностики выгорания',
      },
      {
        property: 'og:type',
        content: 'website',
      },
    ],
  }),
  component: AboutPage,
})
```

### Динамические meta tags

```typescript
export const Route = createFileRoute('/results/$id')({
  loader: async ({ params }) => {
    return await getDiagnostic({ data: { id: params.id } })
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `Результат диагностики #${loaderData.id}`,
        description: `Уровень выгорания: ${loaderData.burnoutLevel.level}. Стадия: ${loaderData.greenbergStage.name}`,
      },
    ],
  }),
  component: ResultsPage,
})
```

---

## Auth Middleware

### Session setup

```typescript
// src/server/auth/session.ts
import { createServerFn } from '@tanstack/start'

export const getSession = createServerFn('GET')
  .handler(async ({ context }) => {
    // Извлечь сессию из cookie/header
    return context.session
  })

export const setSession = createServerFn('POST')
  .handler(async ({ context, data }) => {
    // Установить сессию
    context.session = data
  })
```

### Protected route

```typescript
export const Route = createFileRoute('/history')({
  beforeLoad: async ({ context }) => {
    const session = await getSession()

    if (!session?.userId) {
      throw redirect({ to: '/login' })
    }

    return { user: session }
  },
  loader: async ({ context }) => {
    return await getUserDiagnostics()
  },
  component: HistoryPage,
})
```

---

## Миграция Zustand Store

### До (localStorage)

```typescript
export const useResultsStore = create<ResultsStore>()(
  persist(
    (set, get) => ({
      results: [],
      saveResult: (result) => {
        set({ results: [...get().results, result] })
      },
    }),
    { name: 'burnout-survey-results' }
  )
)
```

### После (server + React Query)

```typescript
// Убрать Zustand, использовать React Query напрямую
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getUserDiagnostics, saveDiagnostic } from '@/server/functions/diagnostics'

function useResults() {
  const queryClient = useQueryClient()

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['diagnostics'],
    queryFn: () => getUserDiagnostics(),
  })

  const saveResultMutation = useMutation({
    mutationFn: saveDiagnostic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostics'] })
    },
  })

  return {
    results,
    isLoading,
    saveResult: saveResultMutation.mutate,
  }
}

// Использование в компоненте
function MyComponent() {
  const { results, saveResult } = useResults()

  return (
    <button onClick={() => saveResult(newResult)}>
      Save
    </button>
  )
}
```

---

## Environment Variables

### .env.local (development)

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/diagnost_dev"
SESSION_SECRET="your-super-secret-key-min-32-chars"
NODE_ENV="development"
```

### Доступ в коде

```typescript
// Server-side только!
const dbUrl = process.env.DATABASE_URL

// Для клиента нужен префикс VITE_
// .env:
// VITE_API_URL="https://api.example.com"

// client code:
const apiUrl = import.meta.env.VITE_API_URL
```

---

## Error Handling

### Global error boundary

```typescript
// src/routes/__root.tsx
import { ErrorComponent } from '@tanstack/react-router'

export const Route = createRootRoute({
  errorComponent: ({ error }) => {
    return (
      <div>
        <h1>Произошла ошибка</h1>
        <pre>{error.message}</pre>
      </div>
    )
  },
  component: RootComponent,
})
```

### Route-specific error handling

```typescript
export const Route = createFileRoute('/history')({
  loader: async () => {
    try {
      return await getUserDiagnostics()
    } catch (error) {
      throw new Error('Не удалось загрузить результаты')
    }
  },
  errorComponent: ({ error }) => {
    return <div>Ошибка загрузки: {error.message}</div>
  },
  component: HistoryPage,
})
```

---

## Deployment Vercel

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output",
  "installCommand": "npm install",
  "framework": null,
  "regions": ["fra1"]
}
```

### Environment Variables (через Vercel Dashboard)

```
DATABASE_URL = postgresql://...
SESSION_SECRET = ...
NODE_ENV = production
```

### Deploy

```bash
# Установить Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod
```

---

## Testing Server Functions

### Vitest пример

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { saveDiagnostic } from '@/server/functions/diagnostics'

describe('diagnostics server functions', () => {
  beforeAll(async () => {
    // Setup test DB
  })

  it('should save diagnostic result', async () => {
    const result = {
      responses: [],
      totalScore: 15,
      // ...
    }

    const saved = await saveDiagnostic({ data: result })

    expect(saved.id).toBeDefined()
    expect(saved.totalScore).toBe(15)
  })
})
```

---

## Полезные хуки

### useServerFn (пользовательский)

```typescript
import { useState } from 'react'

export function useServerFn<T, R>(
  serverFn: (data: T) => Promise<R>
) {
  const [data, setData] = useState<R | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const execute = async (input: T) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await serverFn(input)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { data, error, isLoading, execute }
}

// Usage
function MyComponent() {
  const { data, isLoading, execute } = useServerFn(saveDiagnostic)

  return (
    <button onClick={() => execute(myData)}>
      {isLoading ? 'Saving...' : 'Save'}
    </button>
  )
}
```

---

## Migration Helper

### localStorage to DB migration

```typescript
// src/utils/migrateData.ts
import { saveDiagnostic } from '@/server/functions/diagnostics'

export async function migrateLocalStorageToDb() {
  const localData = localStorage.getItem('burnout-survey-results')

  if (!localData) {
    return { migrated: 0 }
  }

  const { state } = JSON.parse(localData)
  const results = state?.results || []

  let migrated = 0

  for (const result of results) {
    try {
      await saveDiagnostic({ data: result })
      migrated++
    } catch (error) {
      console.error('Failed to migrate result:', error)
    }
  }

  return { migrated, total: results.length }
}

// Компонент миграции
function MigrationButton() {
  const [status, setStatus] = useState('')

  const handleMigrate = async () => {
    setStatus('Migrating...')
    const result = await migrateLocalStorageToDb()
    setStatus(`Migrated ${result.migrated}/${result.total} results`)

    // Очистить localStorage после успешной миграции
    if (result.migrated === result.total) {
      localStorage.removeItem('burnout-survey-results')
    }
  }

  return (
    <div>
      <button onClick={handleMigrate}>
        Migrate from localStorage
      </button>
      <p>{status}</p>
    </div>
  )
}
```