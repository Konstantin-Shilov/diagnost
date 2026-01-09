# Актуальные версии библиотек (Январь 2026)

## ✅ Уже установлено (после обновления)

| Пакет | Текущая версия | Изменение | Статус |
|-------|----------------|-----------|---------|
| `react` | **19.2.3** | ⬆️ 19.1.1 → 19.2.3 | ✅ Актуально |
| `react-dom` | **19.2.3** | ⬆️ 19.1.1 → 19.2.3 | ✅ Актуально |
| `@tanstack/react-router` | **1.146.2** | ⬆️ 1.132.2 → 1.146.2 | ✅ Обновлено |
| `@tanstack/router-plugin` | **1.146.3** | ⬆️ 1.132.2 → 1.146.3 | ✅ Обновлено |
| `vite` | **7.3.1** | ⬆️ 7.2.2 → 7.3.1 | ✅ Обновлено |
| `typescript` | **5.9.3** | ⬆️ 5.9.2 → 5.9.3 | ✅ Актуально |
| `zod` | **4.3.5** | ⬆️ 4.1.11 → 4.3.5 | ⚠️ Beta версия! |
| `zustand` | **5.0.9** | ⬆️ 5.0.8 → 5.0.9 | ✅ Обновлено |
| `jspdf` | **4.0.0** | ⬆️ 3.0.3 → 4.0.0 | ⚠️ Мажорное обновление! |
| `axios` | **1.13.2** | ⬆️ 1.12.2 → 1.13.2 | ✅ Обновлено |
| `vitest` | **4.0.16** | ⬆️ 3.2.4 → 4.0.16 | ⚠️ Мажорное обновление! |
| `@types/node` | **25.0.3** | ⬆️ 24.5.2 → 25.0.3 | ⚠️ Мажорное обновление! |
| `vite-tsconfig-paths` | **6.0.4** | ⬆️ 5.1.4 → 6.0.4 | ⚠️ Мажорное обновление! |

### ⚠️ Важные замечания:

1. **Zod 4.3.5** - все еще beta версия! Для production рекомендуется downgrade на **v3.24.1**
2. **jsPDF 4.0.0** - мажорное обновление, могут быть breaking changes в API
3. **Vitest 4.0.16** - мажорное обновление, проверьте тесты
4. **@types/node 25.0.3** - мажорное обновление, могут быть несовместимости

## 📦 Требуется установить для миграции

### Core пакеты

```bash
# TanStack Start (React-specific)
npm install @tanstack/react-start@latest

# TanStack React Query (для data fetching)
npm install @tanstack/react-query@latest
npm install -D @tanstack/react-query-devtools@latest
```

**Последние версии**:
- `@tanstack/react-start`: **1.145.3** (опубликовано 5 дней назад)
- `@tanstack/react-query`: **5.90.16** (опубликовано 10 дней назад)
- `@tanstack/react-query-devtools`: **5.90.16**

### Database (Prisma ORM)

```bash
# Prisma 7.x с Rust-free клиентом
npm install @prisma/client@latest
npm install -D prisma@latest
```

**Последняя версия**:
- `prisma`: **7.2.0**
- `@prisma/client`: **7.2.0**

**Новое в Prisma 7**:
- Rust-free клиент по умолчанию (быстрее и меньше размер)
- Улучшенный CLI с новой Prisma Studio
- SQL Comments поддержка (v7.1.0)
- Возврат флага `--url` в CLI (v7.2.0)

### TypeScript типы

**Текущая версия**: `@types/node@25.0.3` ✅ (уже обновлено)

## ⚠️ Важные изменения

### 1. TanStack Start теперь использует Vite

С версии **v1.121.0** TanStack Start мигрировал с Vinxi на Vite:

- ❌ **НЕ нужно**: `vinxi`, `@vinxi/react`, `@tanstack/start-vite-plugin`
- ❌ **НЕ нужно**: `app.config.ts` (удалить)
- ✅ **Нужно**: `@tanstack/react-start` (встроенный Vite plugin)
- ✅ **Нужно**: Обновить `vite.config.ts`

Источники:
- [Migrating TanStack Start from Vinxi to Vite](https://blog.logrocket.com/migrating-tanstack-start-vinxi-vite/)
- [TanStack Start v1 Release Candidate](https://tanstack.com/blog/announcing-tanstack-start-v1)

### 2. Zod версия

Проект использует `zod@4.3.5` (обновлено), но актуальная **стабильная** версия Zod — **3.24.x**.

**⚠️ Рекомендация**:
```bash
# Downgrade на стабильную версию v3
npm install zod@^3.24.1
```

**Почему downgrade?**
- Zod 4.x находится в **бета-тестировании**
- Могут быть breaking changes в будущих релизах
- Стабильная v3.24.1 более надежна для production
- TanStack Start и другие библиотеки тестируются с Zod v3

### 3. TanStack Router версия

**✅ Текущая версия**: `1.146.2` (уже обновлено!)
**Последняя версия**: `1.146.3` (совместима с TanStack Start)

**Статус**: Версия актуальна, дополнительное обновление не требуется.

## 🔗 Дополнительные пакеты (опционально)

### Authentication
```bash
# Для session-based auth
npm install iron-session@latest
# или
npm install next-auth@beta  # Если нужен OAuth
```

### Validation
```bash
# Уже установлено
zod@^3.24.1
```

### Email (для уведомлений)
```bash
npm install resend@latest  # Простой API для отправки email
```

### Deployment
```bash
# Vercel CLI
npm install -g vercel@latest
```

## 📚 Источники

### Документация
- [TanStack Start Overview](https://tanstack.com/start/latest/docs/framework/react/overview)
- [TanStack Query v5 Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Prisma 7 Release Blog](https://www.prisma.io/blog/announcing-prisma-orm-7-0-0)
- [Prisma 7.2.0 Release](https://www.prisma.io/blog/announcing-prisma-orm-7-2-0)

### NPM Packages
- [@tanstack/react-start](https://www.npmjs.com/package/@tanstack/react-start)
- [@tanstack/react-query](https://www.npmjs.com/package/@tanstack/react-query)
- [Prisma Releases](https://github.com/prisma/prisma/releases)

---

**Дата обновления**: 2026-01-10
**Статус**: ✅ Актуально