# Интеграция Джойстика в Проект

## 📋 Что было добавлено

### 1. Компоненты React

#### Базовый джойстик
- **Файл**: `src/game/react/components/Joystick.tsx`
- **Стили**: `src/game/react/components/Joystick.css`
- **Описание**: Легкий и производительный джойстик для основного управления

#### Расширенный джойстик
- **Файл**: `src/game/react/components/JoystickAdvanced.tsx`
- **Стили**: `src/game/react/components/JoystickAdvanced.css`
- **Описание**: Джойстик с визуальными эффектами (частицы, волны, сетка, неон) и звуками

### 2. Store для управления состоянием

- **Файл**: `src/game/store/joystick.ts`
- **Функционал**:
  - Хранение текущего вектора джойстика
  - Вычисление угла и магнитуды
  - Интеграция с MobX для реактивности

### 3. Интеграция в игровую сцену

- **Файл**: `src/game/pixi/scenes/GameScene.ts`
- **Функционал**: 
  - Управление AIPlayer с помощью джойстика
  - Реактивное обновление позиции на основе вектора

### 4. Обновленные файлы

- `src/game/react/index.tsx` - добавлен Joystick компонент
- `src/game/store/index.ts` - экспортирует joystickStore
- `index.html` - добавлены CSS переменные для визуальных эффектов

## 🎮 Как использовать

### Вариант 1: Базовый джойстик (текущий)

```tsx
import { Joystick } from './components/Joystick';

<Joystick onVectorChange={handleVectorChange} />
```

### Вариант 2: Расширенный джойстик с эффектами

```tsx
import { JoystickAdvanced } from './components/JoystickAdvanced';

<JoystickAdvanced 
  onVectorChange={handleVectorChange}
  enableEffects={true}
  enableSound={true}
/>
```

### Переключение между версиями

В файле `src/game/react/index.tsx` замените импорт:

```tsx
// Базовая версия (текущая)
import { Joystick } from './components/Joystick';

// ИЛИ

// Расширенная версия
import { JoystickAdvanced as Joystick } from './components/JoystickAdvanced';
```

## 🔧 API и примеры

### Получение данных из Store

```typescript
import { joystickStore } from './game/store/joystick';
import { reaction } from 'mobx';

// В PixiJS сцене
class GameScene extends Container {
  setupControls() {
    reaction(
      () => joystickStore.getVector(),
      (vector) => {
        // vector.x: -1 to 1 (горизонталь)
        // vector.y: -1 to 1 (вертикаль)
        // vector.force: 0 to 1 (сила нажатия)
        this.player.x += vector.x * 5;
        this.player.y += vector.y * 5;
      }
    );
  }
}
```

### Проверка активности

```typescript
if (joystickStore.isActive) {
  console.log('Джойстик используется');
}
```

### Получение угла и магнитуды

```typescript
const angle = joystickStore.getAngle(); // радианы
const magnitude = joystickStore.getMagnitude(); // 0 to 1

// Пример: стрельба в направлении джойстика
if (magnitude > 0.5) {
  shootProjectile(angle);
}
```

## 🎨 Визуальные эффекты

Джойстик создает динамическое свечение фона через CSS переменные:
- `--light-x`: позиция по X (50% центр)
- `--light-y`: позиция по Y (50% центр)
- `--light-size`: размер свечения (30-70%)

Эффекты в расширенной версии:
- **Частицы**: Плавающие частицы, реагирующие на движение
- **Волны**: Круговые волны при сильном нажатии
- **Сетка**: Динамическая сетка с деформацией
- **Неон**: Неоновое свечение с изменением цвета

## 📱 Адаптивность

Джойстик автоматически адаптируется:

| Устройство | Размер | Позиция |
|------------|--------|---------|
| Desktop | 180px | Центр снизу |
| Tablet | 160px | Центр снизу |
| Mobile (портрет) | 140px | Центр снизу |
| Mobile (ландшафт) | 120px | Справа снизу |

## 🚀 Производительность

- ✅ Использует `requestAnimationFrame`
- ✅ Предотвращает лишние рендеры с флагом `needsRender`
- ✅ Оптимизированные обработчики событий
- ✅ CSS анимации с GPU ускорением
- ✅ Минимальное влияние на FPS игры

## 🎯 Совместимость

Поддерживаются три типа ввода (в порядке приоритета):
1. **Pointer Events** (современные браузеры)
2. **Touch Events** (мобильные устройства)
3. **Mouse Events** (старые браузеры)

Протестировано на:
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Desktop Chrome/Firefox/Safari
- ✅ Touch screens
- ✅ Mouse/Trackpad

## 🔊 Звуковые эффекты (только Advanced)

Используется Web Audio API для генерации звуков:
- Звук при начале касания
- Звуки движения (частота зависит от направления)
- Звук при отпускании

Включение звука:
```tsx
<JoystickAdvanced enableSound={true} />
```

## 📚 Дополнительная документация

Подробная документация в файле:
`src/game/react/components/README.md`

## ⚙️ Настройка

### Изменение скорости движения

В `GameScene.ts`:
```typescript
private moveSpeed = 5; // Измените это значение
```

### Изменение размера джойстика

В `Joystick.css`:
```css
.joystick {
  width: 180px;  /* Измените размер */
  height: 180px;
}
```

### Изменение максимального расстояния ручки

В `Joystick.tsx`:
```typescript
const maxDistance = 80; // Измените это значение
```

## 🐛 Отладка

Для логирования векторов джойстика:
```typescript
<Joystick 
  onVectorChange={(v) => {
    console.log(`X: ${v.x.toFixed(2)}, Y: ${v.y.toFixed(2)}, F: ${v.force.toFixed(2)}`);
  }}
/>
```

## 🎁 Бонус: Примеры использования

### Пример 1: 8-направленное движение

```typescript
reaction(
  () => joystickStore.getVector(),
  (vector) => {
    if (vector.force < 0.3) return; // Мертвая зона
    
    const angle = joystickStore.getAngle();
    const direction = Math.round(angle / (Math.PI / 4)) % 8;
    
    // 0: право, 1: верх-право, 2: верх, и т.д.
    player.setDirection(direction);
  }
);
```

### Пример 2: Прицеливание

```typescript
reaction(
  () => joystickStore.getVector(),
  (vector) => {
    if (vector.force > 0.1) {
      const angle = joystickStore.getAngle();
      crosshair.rotation = angle;
      crosshair.visible = true;
    } else {
      crosshair.visible = false;
    }
  }
);
```

### Пример 3: Регулируемая скорость

```typescript
reaction(
  () => joystickStore.getVector(),
  (vector) => {
    const baseSpeed = 100;
    const speed = baseSpeed * vector.force;
    
    player.velocity.x = vector.x * speed;
    player.velocity.y = vector.y * speed;
  }
);
```

---

**Создано**: 2025-10-14  
**Автор интеграции**: AI Assistant  
**Статус**: ✅ Готово к использованию

