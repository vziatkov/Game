# Game

Commercial license. No free support. Do not open GitHub issues or PRs — they will be closed.

See LICENSE for terms.

## 🎮 Tech Stack

- **PixiJS** 8.1.5 - 2D WebGL игровая графика
- **MobX** 6.12.3 - Управление состоянием
- **TypeScript** 5.4.5 - Типизация
- **Vite** 5.2.12 - Сборщик и dev server

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр production версии
npm run serve

# Линтинг
npm run lint

# Тесты
npm run test
```

## 📁 Структура проекта

```
Game/
├── src/
│   ├── main.ts                 # Точка входа
│   ├── preloader/              # Прелоадер
│   │
│   └── game/
│       ├── index.ts            # Загрузчик игры
│       │
│       ├── ui/                 # UI компоненты (Vanilla)
│       │   ├── Joystick.ts     # Джойстик
│       │   └── Joystick.css
│       │
│       ├── pixi/               # PixiJS
│       │   ├── index.ts
│       │   └── scenes/
│       │       ├── BaseGameSprite.ts
│       │       ├── GameScene.ts
│       │       └── AIPlayer.ts
│       │
│       └── store/              # MobX stores
│           ├── index.ts
│           ├── joystick.ts     # Джойстик store
│           ├── game.ts
│           ├── ai.ts
│           └── preloaderStore.ts
│
├── index.html
├── package.json
└── vite.config.ts
```

## 🎮 Джойстик

Проект включает полнофункциональный джойстик на чистом TypeScript:

```typescript
import { Joystick } from './game/ui/Joystick';

const joystick = new Joystick({
  container: document.getElementById('uiRoot')!,
  onVectorChange: (vector) => {
    console.log(vector); // { x, y, force }
  }
});
```

### Документация джойстика

- **Быстрый старт**: `QUICK_START.md`
- **Полная интеграция**: `JOYSTICK_INTEGRATION.md`
- **Миграция без React**: `MIGRATION_NO_REACT.md`
- **Структура файлов**: `JOYSTICK_STRUCTURE.md`
- **Список изменений**: `JOYSTICK_CHANGES.md`

## 🔧 Особенности

### Джойстик
- ✅ Универсальная поддержка ввода (Pointer/Touch/Mouse)
- ✅ Адаптивный дизайн для всех устройств
- ✅ Интеграция с MobX для реактивности
- ✅ Визуальные эффекты и анимации
- ✅ Вибрация на поддерживаемых устройствах
- ✅ Полностью типизированный (TypeScript)

### PixiJS сцены
- ✅ GameScene с поддержкой джойстика
- ✅ AIPlayer с управлением
- ✅ BaseGameSprite для общей логики

### MobX Store
- ✅ Централизованное управление состоянием
- ✅ Реактивные обновления
- ✅ JoystickStore для джойстика
- ✅ GameStore для игровых объектов
- ✅ AIStore для AI логики

## 📦 Зависимости

### Production
- `pixi.js` - WebGL рендеринг
- `mobx` - Управление состоянием
- `typescript` - Типизация
- `vite` - Сборка

### Development
- `eslint` - Линтинг
- `jest` - Тестирование
- `unplugin-swc` - Быстрая компиляция
- `vite-plugin-compression` - Сжатие для продакшена

## 🎯 Scripts

```bash
npm run dev      # Запуск dev сервера (порт 3000)
npm run build    # Сборка для продакшена
npm run serve    # Предпросмотр production сборки
npm run lint     # Проверка кода
npm run test     # Запуск тестов
```

## 📱 Совместимость

- ✅ Desktop (Chrome, Firefox, Safari)
- ✅ Mobile iOS (Safari)
- ✅ Mobile Android (Chrome)
- ✅ Планшеты
- ✅ Touch screens
- ✅ Mouse/Keyboard

## 🔍 Размер bundle (после миграции)

```
Production build:
├── index.js      ~110 KB (gzipped: ~40 KB)
├── vendor.js     ~50 KB  (gzipped: ~18 KB)
└── assets        ~2 KB
Total:            ~162 KB (gzipped: ~60 KB)
```

## 🚀 Производительность

- **FPS**: 60 стабильно
- **Время загрузки**: < 1 сек (с кешем)
- **Размер bundle**: ~160 KB
- **Memory usage**: < 50 MB

## 📝 Лицензия

Commercial license. См. LICENSE файл.

---

**Версия**: 1.0.0  
**Дата**: 14 октября 2025
