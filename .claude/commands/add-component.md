Создай новый React компонент следуя архитектуре проекта:

1. Создай файл компонента в нужной директории (components/ или common/shared/ui/)
2. Используй TypeScript с типизированными Props
3. Создай CSS Module файл рядом с компонентом
4. Следуй naming conventions:
   - Компонент: PascalCase
   - Файл стилей: Component.module.css
   - CSS классы: camelCase
5. Добавь mobile-first адаптивность (@media max-width: 640px)

Структура компонента:
```typescript
import React from 'react';
import styles from './Component.module.css';

interface ComponentProps {
  // props
}

export const Component: React.FC<ComponentProps> = (props) => {
  return (
    <div className={styles.container}>
      {/* content */}
    </div>
  );
};
```