# Ключевые особенности реализации

## 1. Система скоринга (analysisService.ts)

Формула расчета итогового балла:
- Симптомы × 0.5 + Причины × 0.3 + Состояние × 0.2
- Максимальный балл: 30
  - Симптомы: 10 вопросов × 3 = 30 → 30 × 0.5 = 15
  - Причины: 15 вопросов × 3 = 45 → 45 × 0.3 = 13.5
  - Состояние: 3 вопроса → max 9 → 9 × 0.2 = 1.8

## 2. Экспорт в PDF с кириллицей

Загрузка Roboto TTF с CDN для поддержки кириллицы:
- Fetch шрифта с cdnjs.cloudflare.com
- Конвертация ArrayBuffer в base64
- Регистрация шрифта в jsPDF

## 3. Адаптивная шапка с бургер-меню

- Desktop: горизонтальное меню
- Mobile: бургер-меню с overlay
- Фиксированная позиция при скролле
- Автоматическое закрытие при смене роута

## 4. Хранение результатов

localStorage через Zustand persist middleware.

Структура DiagnosticResult:
- id: string
- timestamp: Date
- responses: SurveyResponse[]
- burnoutLevel: BurnoutLevel
- greenbergStage: GreenbergStage
- totalScore: number
- recommendations: string[]