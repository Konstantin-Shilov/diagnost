Создай новый роут используя TanStack Router file-based routing:

1. Создай файл роута в `src/core/app/routing/routes/`
2. Используй createFileRoute для определения роута
3. Экспортируй Route с компонентом
4. Если нужны параметры, используй $param синтаксис (например, results.$id.tsx)

Структура роута:
```typescript
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/path')({
  component: PageComponent,
});

function PageComponent() {
  return <div>Content</div>;
}
```

После создания роута, запусти typecheck для регенерации routeTree.