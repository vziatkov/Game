import { BaseGameSprite } from 'src/game/pixi/scenes/BaseGameSprite';
import { generatePrompt, generateScenario } from 'src/game/store/ai';

export class AIPlayer extends BaseGameSprite {
  private currentScenario: string = '';
  private chatHistory: string[] = [];

  async init() {
    await super.init();
    // теперь init только для графики/ресурсов
  }

  // отдельный метод для инициализации сценария (вызвать отдельно после загрузки графики)
  public initScenario = async (seed?: string): Promise<void> => {
    const promptSeed = seed ?? 'Create a simple adventure scenario for a game.';
    this.currentScenario = await generateScenario(promptSeed);
  }

  public interact = async (playerInput: string): Promise<string> => {
    this.chatHistory.push(`Player: ${playerInput}`);
    const context = `${this.currentScenario}\n${this.chatHistory.slice(-5).join('\n')}`;
    const response = await generatePrompt(`AI response to: ${playerInput} in context: ${context}`);
    this.chatHistory.push(`AI: ${response}`);
    return response;
  }

  // Заготовка протокола для мультиплеера — можно отправлять/принимать сообщения
  public toNetworkPayload = () => {
    return {
      type: 'ai_player_state',
      scenario: this.currentScenario,
      history: this.chatHistory.slice(-20),
    };
  }

  public applyNetworkPayload = (payload: unknown) => {
    if (!payload || typeof payload !== 'object') return;
    const p = payload as Record<string, unknown>;
    if (typeof p.scenario === 'string') this.currentScenario = p.scenario;
    if (Array.isArray(p.history)) this.chatHistory = p.history.map(String);
  }

  public getChatHistory = (): string[] => {
    return this.chatHistory;
  }
}

