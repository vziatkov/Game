# 📁 Структура файлов джойстика

```
Game/
├── index.html                          [ИЗМЕНЕН] HTML с CSS переменными для эффектов
│
├── JOYSTICK_INTEGRATION.md             [НОВЫЙ] Полная документация интеграции
├── QUICK_START.md                      [НОВЫЙ] Быстрый старт и примеры
├── JOYSTICK_CHANGES.md                 [НОВЫЙ] Список всех изменений
└── JOYSTICK_STRUCTURE.md               [НОВЫЙ] Этот файл (структура)
│
└── src/
    ├── main.ts                         [БЕЗ ИЗМЕНЕНИЙ]
    ├── App.tsx                         [БЕЗ ИЗМЕНЕНИЙ]
    │
    └── game/
        ├── index.tsx                   [БЕЗ ИЗМЕНЕНИЙ]
        │
        ├── react/
        │   ├── index.tsx               [ИЗМЕНЕН] Добавлен Joystick компонент
        │   │
        │   └── components/
        │       ├── Joystick.tsx        [НОВЫЙ] ⭐ Базовый джойстик
        │       ├── Joystick.css        [НОВЫЙ] Стили базового джойстика
        │       ├── JoystickAdvanced.tsx [НОВЫЙ] ⭐ Расширенный джойстик
        │       ├── JoystickAdvanced.css [НОВЫЙ] Стили расширенного джойстика
        │       └── README.md           [НОВЫЙ] Документация компонентов
        │
        ├── pixi/
        │   ├── index.ts                [БЕЗ ИЗМЕНЕНИЙ]
        │   │
        │   └── scenes/
        │       ├── BaseGameSprite.ts   [БЕЗ ИЗМЕНЕНИЙ]
        │       ├── GameScene.ts        [НОВЫЙ] ⭐ Сцена с интеграцией джойстика
        │       └── AIPlayer.ts         [НОВЫЙ] AI игрок
        │
        └── store/
            ├── index.ts                [ИЗМЕНЕН] Добавлен joystickStore
            ├── joystick.ts             [НОВЫЙ] ⭐ MobX store для джойстика
            ├── ai.ts                   [БЕЗ ИЗМЕНЕНИЙ]
            ├── game.ts                 [БЕЗ ИЗМЕНЕНИЙ]
            └── preloaderStore.ts       [БЕЗ ИЗМЕНЕНИЙ]
```

## 🔑 Ключевые файлы

### ⭐ Joystick.tsx
**Путь**: `src/game/react/components/Joystick.tsx`

**Описание**: Основной React-компонент джойстика

**Ключевые особенности**:
- Универсальная поддержка ввода (Pointer/Touch/Mouse)
- Адаптивный дизайн для разных устройств
- Оптимизированный рендеринг с requestAnimationFrame
- Нормализованные векторы от -1 до 1
- Визуальные эффекты свечения

**Экспорт**:
```typescript
export const Joystick: React.FC<JoystickProps>
```

**Props**:
- `onVectorChange?: (vector: { x, y, force }) => void`
- `className?: string`

---

### ⭐ JoystickAdvanced.tsx
**Путь**: `src/game/react/components/JoystickAdvanced.tsx`

**Описание**: Расширенная версия с эффектами

**Дополнительные возможности**:
- 4 визуальных эффекта (частицы, волны, сетка, неон)
- Звуковые эффекты (Web Audio API)
- Кнопки управления эффектами
- Переключатель звука

**Props**:
- `onVectorChange?: (vector: { x, y, force }) => void`
- `className?: string`
- `enableEffects?: boolean`
- `enableSound?: boolean`

---

### ⭐ joystick.ts
**Путь**: `src/game/store/joystick.ts`

**Описание**: MobX store для управления состоянием джойстика

**State**:
```typescript
{
  vector: { x: number, y: number, force: number }
  isActive: boolean
}
```

**Методы**:
- `updateVector(vector)` - обновление вектора
- `reset()` - сброс в начальное состояние
- `getVector()` - получение текущего вектора
- `getAngle()` - получение угла в радианах
- `getMagnitude()` - получение магнитуды (0-1)

**Экспорт**:
```typescript
export const joystickStore: JoystickStore
export interface JoystickVector { x, y, force }
```

---

### ⭐ GameScene.ts
**Путь**: `src/game/pixi/scenes/GameScene.ts`

**Описание**: PixiJS сцена с интеграцией джойстика

**Ключевые особенности**:
- Управление AIPlayer с помощью джойстика
- MobX reaction для реактивного обновления
- Ограничение движения в пределах экрана
- Корректная очистка при уничтожении

**Пример интеграции**:
```typescript
private setupJoystickControls() {
  this.joystickDisposer = reaction(
    () => joystickStore.getVector(),
    (vector) => this.updatePlayerMovement(vector)
  );
}
```

---

## 🔄 Поток данных

```
Пользователь
    ↓
Касание/Клик на джойстике
    ↓
Joystick.tsx (обработчики событий)
    ↓
onVectorChange callback
    ↓
joystickStore.updateVector()
    ↓
MobX реакция (автоматически)
    ↓
GameScene.updatePlayerMovement()
    ↓
Обновление позиции AIPlayer
    ↓
PixiJS рендеринг
```

## 📦 Зависимости между компонентами

```
Joystick.tsx
    └─> joystickStore (опционально, только для примера)

JoystickAdvanced.tsx
    └─> joystickStore (опционально)

react/index.tsx
    ├─> Joystick (импорт компонента)
    └─> joystickStore (для обновления)

GameScene.ts
    ├─> joystickStore (чтение данных)
    ├─> AIPlayer (управление)
    └─> MobX reaction (реактивность)

store/index.ts
    └─> joystickStore (экспорт)
```

## 🎯 Точки входа

### Для React разработки:
**Файл**: `src/game/react/index.tsx`
```typescript
import { Joystick } from './components/Joystick';
```

### Для игровой логики:
**Файл**: `src/game/pixi/scenes/GameScene.ts`
```typescript
import { joystickStore } from '../../store/joystick';
```

### Для прямого доступа к store:
**Файл**: Любой
```typescript
import { joystickStore } from './game/store/joystick';
```

## 🔧 Конфигурационные файлы

### Стили
- `Joystick.css` - стили базового джойстика
- `JoystickAdvanced.css` - стили эффектов
- `index.html` - глобальные CSS переменные

### TypeScript
- `joystick.ts` - интерфейсы и типы
- `JoystickVector` - тип для вектора

## 📚 Документация

### Для начинающих:
1. **QUICK_START.md** - быстрый старт
2. **components/README.md** - использование компонентов

### Для продвинутых:
1. **JOYSTICK_INTEGRATION.md** - полная документация
2. **JOYSTICK_CHANGES.md** - список изменений
3. **JOYSTICK_STRUCTURE.md** - структура (этот файл)

### Для разработчиков:
- Inline комментарии в коде
- JSDoc комментарии в функциях
- TypeScript интерфейсы

## 🎨 Стилизация

### CSS Переменные (в index.html):
```css
--light-x: 50%     /* Позиция свечения по X */
--light-y: 50%     /* Позиция свечения по Y */
--light-size: 40%  /* Размер свечения */
```

### CSS Классы (в Joystick.css):
- `.joystick-wrapper` - обертка джойстика
- `.joystick-container` - контейнер с фоном
- `.joystick` - круг джойстика
- `.knob` - ручка джойстика
- `.values` - контейнер значений
- `.value` - отдельное значение
- `.touch-feedback` - анимация касания

### CSS Эффекты (в JoystickAdvanced.css):
- `.particles` - контейнер частиц
- `.particle` - отдельная частица
- `.waves` - контейнер волн
- `.wave` - отдельная волна
- `.grid-overlay` - сетка
- `.neon-glow` - неоновое свечение
- `.effect-buttons` - кнопки эффектов
- `.effect-btn` - отдельная кнопка

## 🔍 Поиск файлов

### По функциональности:

**Компоненты UI**:
```bash
src/game/react/components/
```

**Логика игры**:
```bash
src/game/pixi/scenes/
```

**Управление состоянием**:
```bash
src/game/store/
```

**Стили**:
```bash
src/game/react/components/*.css
index.html
```

**Документация**:
```bash
*.md (в корне проекта)
src/game/react/components/README.md
```

## 🚀 Быстрые команды

### Найти все упоминания джойстика:
```bash
grep -r "joystick" src/
```

### Найти импорты джойстика:
```bash
grep -r "import.*Joystick" src/
```

### Найти использование store:
```bash
grep -r "joystickStore" src/
```

### Проверить размер bundle:
```bash
npm run build
ls -lh dist/
```

---

**Версия**: 1.0.0  
**Дата**: 14 октября 2025  
**Файлов**: 11 новых, 3 изменённых

