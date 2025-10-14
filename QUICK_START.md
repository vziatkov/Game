# 🚀 Быстрый старт с джойстиком

## Запуск проекта

```bash
# Установка зависимостей (если еще не установлены)
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр собранной версии
npm serve
```

## Тестирование джойстика

### На компьютере (Desktop)

1. Откройте проект в браузере: `http://localhost:5173` (или другой порт, который показывает Vite)
2. Внизу экрана появится джойстик
3. Используйте **мышь** для управления:
   - Нажмите и удерживайте на джойстике
   - Двигайте мышью для управления направлением
   - Отпустите для возврата в центр

### На мобильном устройстве

1. Откройте проект на том же локальном IP (например: `http://192.168.1.100:5173`)
2. Коснитесь джойстика пальцем
3. Двигайте пальцем для управления
4. Отпустите для возврата в центр

### Тестирование в DevTools

Chrome/Firefox DevTools позволяют эмулировать касания:

1. Откройте DevTools (F12)
2. Нажмите кнопку "Toggle device toolbar" (Ctrl+Shift+M)
3. Выберите мобильное устройство (например, iPhone 12)
4. Теперь клики мыши будут работать как касания

## Что должно работать

✅ **Визуально:**
- Джойстик виден внизу экрана
- Ручка джойстика плавно двигается при взаимодействии
- Фон имеет легкое свечение (космическая тема)
- Значения X, Y, Force обновляются в реальном времени

✅ **Функционально:**
- AIPlayer двигается в соответствии с джойстиком (если загружена текстура)
- Движение плавное и отзывчивое
- При отпускании джойстик возвращается в центр с анимацией
- На мобильных устройствах работает вибрация (если поддерживается)

✅ **Адаптивность:**
- На мобильном джойстик меньше размером
- В ландшафтной ориентации перемещается вправо
- Корректно работает при изменении размера окна

## Переключение на расширенную версию

Чтобы использовать джойстик с эффектами:

**Отредактируйте** `src/game/react/index.tsx`:

```tsx
// Замените эту строку:
import { Joystick } from './components/Joystick';

// На эту:
import { JoystickAdvanced as Joystick } from './components/JoystickAdvanced';

// И обновите использование:
<Joystick 
  onVectorChange={handleVectorChange}
  enableEffects={true}
  enableSound={true}
/>
```

**Перезапустите dev сервер** и теперь будут доступны:
- Кнопки выбора эффектов (Частицы, Волны, Сетка, Неон)
- Кнопка включения/выключения звука
- Визуальные эффекты при движении джойстика

## Отладка

### Джойстик не отображается

Проверьте:
1. `store.preloader.appLoaded` возвращает `true`
2. React компонент рендерится (проверьте в React DevTools)
3. CSS стили загружены

### Джойстик не реагирует на касания

Проверьте консоль браузера на ошибки:
```javascript
// В консоли браузера:
console.log(joystickStore.getVector());
```

### AIPlayer не двигается

Проверьте:
1. Текстура загружена (`src/assets/images/ai-avatar.webp` существует)
2. GameScene корректно инициализирована
3. Joystick store обновляется (добавьте логи)

### Производительность низкая

1. Используйте базовую версию джойстика вместо Advanced
2. Отключите эффекты: `enableEffects={false}`
3. Проверьте количество объектов на сцене PixiJS

## Конфигурация

### Изменить позицию джойстика

Отредактируйте `src/game/react/components/Joystick.css`:

```css
.joystick-wrapper {
  /* Текущая позиция: центр снизу */
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  
  /* Для правого нижнего угла: */
  /* left: auto;
  right: 20px;
  transform: none; */
  
  /* Для левого нижнего угла: */
  /* left: 20px;
  transform: none; */
}
```

### Изменить чувствительность

В `src/game/pixi/scenes/GameScene.ts`:

```typescript
private moveSpeed = 5; // Увеличьте для быстрого движения
```

### Добавить мертвую зону

В `src/game/pixi/scenes/GameScene.ts`:

```typescript
private updatePlayerMovement(vector: JoystickVector) {
  if (!this.aiPlayer) return;
  
  // Добавьте проверку на минимальную силу
  if (vector.force < 0.2) return; // Мертвая зона 20%
  
  const moveX = vector.x * this.moveSpeed;
  const moveY = vector.y * this.moveSpeed;
  
  this.aiPlayer.x += moveX;
  this.aiPlayer.y += moveY;
}
```

## Интеграция с игровой логикой

### Пример: Управление персонажем

```typescript
import { joystickStore } from './game/store/joystick';
import { reaction } from 'mobx';

class PlayerController {
  constructor(private sprite: Sprite) {
    this.setupJoystick();
  }
  
  private setupJoystick() {
    reaction(
      () => joystickStore.getVector(),
      (vector) => {
        this.sprite.x += vector.x * 5;
        this.sprite.y += vector.y * 5;
        
        // Поворот спрайта в направлении движения
        if (vector.force > 0.1) {
          this.sprite.rotation = Math.atan2(vector.y, vector.x);
        }
      }
    );
  }
}
```

### Пример: Стрельба в направлении

```typescript
reaction(
  () => ({
    vector: joystickStore.getVector(),
    active: joystickStore.isActive
  }),
  ({ vector, active }) => {
    if (active && vector.force > 0.5) {
      const angle = joystickStore.getAngle();
      this.shoot(angle);
    }
  }
);
```

## Полезные ссылки

- **Полная документация**: `JOYSTICK_INTEGRATION.md`
- **API Reference**: `src/game/react/components/README.md`
- **Store документация**: Смотрите `src/game/store/joystick.ts`

## Проблемы?

Если что-то не работает:

1. Проверьте консоль браузера (F12) на ошибки
2. Убедитесь, что все зависимости установлены
3. Очистите кеш браузера (Ctrl+Shift+R)
4. Перезапустите dev сервер

---

**Готово! Джойстик интегрирован и готов к использованию! 🎮**

