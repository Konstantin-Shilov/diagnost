# Стиль кодирования

## Naming Conventions

### Файлы и папки
- **Компоненты**: PascalCase (`Button.tsx`, `SurveyContainer.tsx`)
- **Стили**: kebab-case с суффиксом `.module.css` (`Button.module.css`)
- **Утилиты/сервисы**: camelCase (`analysisService.ts`, `pdfExportService.ts`)
- **Типы**: camelCase (`survey.ts`, `storage.ts`)
- **Папки**: camelCase (`resultsStore`, `surveyConfig`)

### Код
- **Компоненты**: PascalCase (`export const Button = ...`)
- **Функции/переменные**: camelCase (`const formatDate = ...`)
- **Константы**: camelCase (`const defaultSurveyConfig = ...`)
- **CSS классы**: camelCase (`.container`, `.detailedAnswersSection`)
- **Типы/интерфейсы**: PascalCase (`type SurveyResponse`, `interface ButtonProps`)

## Структура компонентов

```typescript
// Импорты: сначала внешние, затем внутренние
import React from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/Button";
import { Text } from "@/components/Typography";

import styles from "./Component.module.css";

// Типы Props
interface ComponentProps {
  title: string;
  onClick?: () => void;
}

// Экспорт компонента
export const Component: React.FC<ComponentProps> = ({ title, onClick }) => {
  // Хуки
  const navigate = useNavigate();

  // Обработчики
  const handleClick = () => {
    onClick?.();
  };

  // Рендер
  return (
    <div className={styles.container}>
      <Text>{title}</Text>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
};
```

## CSS Modules паттерны

```css
/* Основной контейнер */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* Вложенные элементы */
.header {
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  color: #007bff;
}

/* Модификаторы */
.button.primary {
  background-color: #007bff;
}

.button.secondary {
  background-color: #6c757d;
}

/* Mobile-first адаптивность */
@media (max-width: 640px) {
  .container {
    padding: 12px;
  }

  .title {
    font-size: 20px;
  }
}
```

## Zustand Store паттерны

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  // State
  data: SomeType | null;

  // Actions
  setData: (data: SomeType) => void;
  clearData: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Initial state
      data: null,

      // Actions
      setData: (data) => set({ data }),
      clearData: () => set({ data: null }),
    }),
    {
      name: "store-name", // ключ в localStorage
    }
  )
);
```

## TanStack Router паттерны

```typescript
// Создание роута
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/path")({
  component: PageComponent,
});

function PageComponent() {
  return <div>Content</div>;
}

// Роут с параметрами
export const Route = createFileRoute("/results/$id")({
  component: ResultsPage,
});

function ResultsPage() {
  const { id } = Route.useParams();
  return <div>Result {id}</div>;
}
```