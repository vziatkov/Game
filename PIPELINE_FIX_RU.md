# Исправление падающего пайплайна на main ветке

## Проблема

Пайплайн Deploy to GitHub Pages на main ветке падал при каждом пуше в main.

## Причина

При анализе логов выполнения workflow было обнаружено, что используются **устаревшие версии GitHub Actions**, которые больше не поддерживаются GitHub:

1. `actions/upload-pages-artifact@v1` - устаревшая версия
2. `actions/deploy-pages@v1` - устаревшая версия  
3. `actions/configure-pages@v3` - старая версия

GitHub автоматически отклоняет запуск workflow-ов, использующих устаревшие версии actions v1 и v3 для артефактов.

## Решение

Обновлены версии GitHub Actions в файле `.github/workflows/deploy.yml`:

### Изменения версий:
- `actions/configure-pages@v3` → `actions/configure-pages@v5`
- `actions/upload-pages-artifact@v1` → `actions/upload-pages-artifact@v3`
- `actions/deploy-pages@v1` → `actions/deploy-pages@v4`

### Дополнительные улучшения:
- Добавлена спецификация `environment` для лучшего контроля деплоя
- Добавлен `id: deployment` к шагу деплоя для получения URL страницы
- Настроен вывод URL развернутой страницы через `steps.deployment.outputs.page_url`

## Проверка

Локальная проверка показала, что:
- ✅ Lint проходит успешно
- ✅ Тесты выполняются без ошибок
- ✅ Сборка проекта завершается успешно
- ✅ CI workflow на PR проходит

## Результат

После мержа этого PR в main ветку:
- Пайплайн Deploy to GitHub Pages будет успешно выполняться
- Сайт будет автоматически разворачиваться на GitHub Pages при каждом пуше в main
- В логах workflow будет отображаться URL развернутой страницы

## Файлы изменены

- `.github/workflows/deploy.yml` - обновлены версии actions и добавлена конфигурация environment
