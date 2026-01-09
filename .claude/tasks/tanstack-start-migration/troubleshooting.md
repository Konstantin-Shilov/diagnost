# Troubleshooting - Решение проблем при миграции

## Частые проблемы и решения

### 1. "window is not defined" (SSR ошибка)

**Проблема**: Код использует browser API во время SSR

```typescript
// ❌ Не работает при SSR
const value = window.localStorage.getItem('key')
```

**Решение 1**: Проверка окружения

```typescript
// ✅ Работает
const value = typeof window !== 'undefined'
  ? window.localStorage.getItem('key')
  : null
```

**Решение 2**: useEffect для browser-only кода

```typescript
// ✅ Работает
function MyComponent() {
  useEffect(() => {
    // Этот код выполнится только на клиенте
    const value = window.localStorage.getItem('key')
  }, [])
}
```

**Решение 3**: Dynamic import

```typescript
// ✅ Работает
const MyClientComponent = lazy(() => import('./ClientOnlyComponent'))

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyClientComponent />
    </Suspense>
  )
}
```

---

### 2. Prisma Client ошибки

#### "PrismaClient is unable to be run in the browser"

**Проблема**: Prisma импортирован в client-side коде

```typescript
// ❌ Не импортировать в компонентах!
import { prisma } from '@/server/db/prisma'
```

**Решение**: Использовать только в server functions

```typescript
// ✅ server/functions/diagnostics.ts
import { prisma } from '@/server/db/prisma'

export const getDiagnostics = createServerFn('GET')
  .handler(async () => {
    return await prisma.diagnosticResult.findMany()
  })
```

#### "Can't reach database server"

**Проблема**: Неверный DATABASE_URL или БД недоступна

**Решение**:
1. Проверьте `.env` файл
2. Проверьте что БД запущена (для локальной разработки)
3. Проверьте firewall rules (для облачной БД)

```bash
# Проверка подключения
npx prisma db pull

# Если ошибка, проверьте DATABASE_URL
echo $DATABASE_URL
```

---

### 3. Server Functions не работают

#### TypeError: serverFn is not a function

**Проблема**: Server function вызван неправильно

```typescript
// ❌ Неверно
const result = getDiagnostics

// ✅ Правильно
const result = await getDiagnostics()
```

#### 401 Unauthorized при вызове

**Проблема**: Нет сессии или неверная проверка авторизации

**Решение**:
1. Проверьте что сессия установлена
2. Временно отключите auth для отладки

```typescript
// Временно для отладки
export const getDiagnostics = createServerFn('GET')
  .handler(async () => {
    // Закомментировать проверку
    // const userId = context.session?.userId
    // if (!userId) throw new Error('Unauthorized')

    // Использовать hardcoded userId для теста
    const userId = 'test-user-id'

    return await prisma.diagnosticResult.findMany({
      where: { userId },
    })
  })
```

#### Validation error

**Проблема**: Данные не соответствуют Zod схеме

```typescript
// Ошибка в консоли покажет что именно не так
ZodError: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": ["email"]
  }
]
```

**Решение**: Проверьте что все обязательные поля присутствуют

```typescript
// ❌ Неверно - отсутствует email
await login({ data: { password: '123456' } })

// ✅ Правильно
await login({ data: { email: 'test@example.com', password: '123456' } })
```

---

### 4. Vite / Build ошибки

#### "Failed to resolve import"

**Проблема**: Неверный путь импорта или отсутствует alias

**Решение**: Проверьте `tsconfig.json` и `vite.config.ts`

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

```typescript
// vite.config.ts
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
})
```

#### "Module not found" для server imports

**Проблема**: Server код импортируется на клиенте

**Решение**: Используйте `.server.ts` суффикс для server-only файлов

```typescript
// prisma.server.ts - не будет включен в client bundle
export const prisma = new PrismaClient()

// или используйте dynamic import в server functions
```

---

### 5. Deployment ошибки (Vercel)

#### Build fails with Prisma error

**Проблема**: Prisma не сгенерирован в build time

**Решение**: Добавьте postinstall script

```json
// package.json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

#### Database migration issues

**Проблема**: Миграции не применены на production

**Решение**: Выполните миграции вручную

```bash
# Из локальной машины с production DATABASE_URL
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Или добавьте в build script (не рекомендуется для production)
"build": "prisma migrate deploy && vinxi build"
```

#### Environment variables not found

**Проблема**: Переменные не добавлены в Vercel

**Решение**:
1. Зайдите в Vercel Dashboard → Project → Settings → Environment Variables
2. Добавьте все переменные из `.env`
3. Redeploy проект

---

### 6. Type errors

#### "Type 'Json' is not assignable to type 'DiagnosticResult'"

**Проблема**: Prisma возвращает Json тип для Json полей

**Решение**: Добавьте type assertion

```typescript
const result = await prisma.diagnosticResult.findUnique({
  where: { id }
})

return result as unknown as DiagnosticResult
```

#### "Property 'session' does not exist on type 'Context'"

**Проблема**: Context не типизирован

**Решение**: Расширьте типы TanStack Start

```typescript
// src/types/tanstack-start.d.ts
import type { User } from '@prisma/client'

declare module '@tanstack/start' {
  interface Context {
    session?: {
      userId: string
      user?: User
    }
  }
}
```

---

### 7. Performance issues

#### Slow SSR response time

**Проблема**: Медленные database queries в loader

**Решение 1**: Добавьте индексы в Prisma

```prisma
model DiagnosticResult {
  // ...
  @@index([userId, timestamp])
}
```

**Решение 2**: Кешируйте результаты

```typescript
export const Route = createFileRoute('/history')({
  loader: async () => {
    return await getUserDiagnostics()
  },
  // Добавьте stale time
  loaderOptions: {
    staleTime: 5000, // 5 секунд кеш
  },
  component: HistoryPage,
})
```

#### Large bundle size

**Проблема**: Слишком большой JavaScript bundle

**Решение**: Code splitting

```typescript
// Используйте lazy import для тяжелых библиотек
const PDFViewer = lazy(() => import('./PDFViewer'))

// В TanStack Router используйте autoCodeSplitting
tanStackRouter({
  autoCodeSplitting: true, // ✅ Уже включено
})
```

---

### 8. Локальная разработка

#### Hot reload не работает

**Проблема**: Vinxi не подхватывает изменения

**Решение**: Перезапустите dev server

```bash
# Ctrl+C для остановки
npm run dev
```

#### Port 3000 already in use

**Проблема**: Порт занят другим процессом

**Решение**: Измените порт или убейте процесс

```bash
# Найти процесс
lsof -i :3000

# Убить процесс
kill -9 <PID>

# Или используйте другой порт
PORT=3001 npm run dev
```

---

### 9. Session / Auth issues

#### Session not persisting

**Проблема**: Cookie не сохраняется

**Решение**: Проверьте настройки cookie

```typescript
// src/server/auth/session.ts
export const setSession = createServerFn('POST')
  .handler(async ({ context, data }) => {
    // Установите cookie с правильными параметрами
    setCookie(context.res, 'session', data, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    })
  })
```

#### CORS errors

**Проблема**: Разные домены для frontend/backend

**Решение**: Настройте CORS (обычно не нужно для TanStack Start)

```typescript
// app.config.ts
export default defineConfig({
  server: {
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true,
    },
  },
})
```

---

### 10. Миграция данных

#### localStorage data not migrating

**Проблема**: Данные в неправильном формате

**Решение**: Проверьте формат данных

```typescript
const data = localStorage.getItem('burnout-survey-results')
console.log('Raw data:', data)

const parsed = JSON.parse(data)
console.log('Parsed:', parsed)

// Проверьте структуру
console.log('Structure:', Object.keys(parsed))
```

#### Duplicate key errors

**Проблема**: Попытка создать дубликат (unique constraint)

**Решение**: Используйте upsert или проверку

```typescript
// Вместо create
await prisma.diagnosticResult.create({ data })

// Используйте upsert
await prisma.diagnosticResult.upsert({
  where: { id: data.id },
  create: data,
  update: data,
})
```

---

## Debug режим

### Включить подробное логирование Prisma

```typescript
// src/server/db/prisma.ts
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

### Включить source maps

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true,
  },
})
```

### Включить React DevTools

```typescript
// src/routes/__root.tsx
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
})
```

---

## Получение помощи

### Официальные ресурсы
- [TanStack Discord](https://discord.com/invite/WrRKjPJ)
- [Prisma Discord](https://discord.gg/prisma)
- [GitHub Issues - TanStack Start](https://github.com/tanstack/router/issues)

### Создание bug report

Включите:
1. Версии зависимостей (`npm list`)
2. Код, который не работает
3. Stack trace ошибки
4. Что уже пробовали

```bash
# Экспорт версий зависимостей
npm list @tanstack/start @tanstack/react-router prisma > versions.txt
```

---

## Профилактика проблем

### Checklist перед коммитом
- [ ] `npm run typecheck` проходит
- [ ] `npm run build` проходит
- [ ] Локально всё работает
- [ ] Нет console.error в браузере
- [ ] Server functions работают

### Checklist перед деплоем
- [ ] Все environment variables добавлены
- [ ] Миграции применены
- [ ] Preview deploy протестирован
- [ ] Rollback план готов