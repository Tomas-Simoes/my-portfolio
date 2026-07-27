import { useEffect } from 'react';
import type { InputAction, InputActionEvent, InputActionHandler, InputPhase } from './inputActions';
import { inputBindings } from './inputBindings';

type Subscription = {
  phase: InputPhase;
  handler: InputActionHandler;
};

class InputManager {
  private readonly actionsByKey = new Map<string, InputAction[]>();
  private readonly pressedActions = new Set<InputAction>();
  private readonly subscriptions = new Map<InputAction, Set<Subscription>>();
  private listenerCount = 0;

  constructor(bindings: Record<InputAction, readonly string[]>) {
    Object.entries(bindings).forEach(([action, keys]) => {
      keys.forEach((key) => {
        const existingActions = this.actionsByKey.get(key) ?? [];
        this.actionsByKey.set(key, [...existingActions, action as InputAction]);
      });
    });
  }

  connect() {
    if (this.listenerCount === 0) {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
      window.addEventListener('blur', this.clearPressedActions);
    }

    this.listenerCount += 1;

    return () => {
      this.listenerCount = Math.max(0, this.listenerCount - 1);

      if (this.listenerCount === 0) {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('blur', this.clearPressedActions);
        this.clearPressedActions();
      }
    };
  }

  subscribe(action: InputAction, phase: InputPhase, handler: InputActionHandler) {
    const actionSubscriptions = this.subscriptions.get(action) ?? new Set<Subscription>();
    const subscription = { phase, handler };

    actionSubscriptions.add(subscription);
    this.subscriptions.set(action, actionSubscriptions);

    return () => {
      actionSubscriptions.delete(subscription);
    };
  }

  isPressed(action: InputAction) {
    return this.pressedActions.has(action);
  }

  clear() {
    this.clearPressedActions();
  }

  private emit(action: InputAction, phase: InputPhase, keyboardEvent: KeyboardEvent) {
    const actionSubscriptions = this.subscriptions.get(action);

    if (!actionSubscriptions) {
      return;
    }

    const inputEvent: InputActionEvent = {
      action,
      phase,
      keyboardEvent,
    };

    actionSubscriptions.forEach((subscription) => {
      if (subscription.phase === phase) {
        subscription.handler(inputEvent);
      }
    });
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const actions = this.actionsByKey.get(event.code);

    if (!actions) {
      return;
    }

    actions.forEach((action) => {
      if (this.pressedActions.has(action)) {
        return;
      }

      this.pressedActions.add(action);
      this.emit(action, 'started', event);
    });
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    const actions = this.actionsByKey.get(event.code);

    if (!actions) {
      return;
    }

    actions.forEach((action) => {
      if (!this.pressedActions.has(action)) {
        return;
      }

      this.pressedActions.delete(action);
      this.emit(action, 'ended', event);
    });
  };

  private clearPressedActions = () => {
    this.pressedActions.clear();
  };
}

export const inputManager = new InputManager(inputBindings);

export function InputListener() {
  useEffect(() => inputManager.connect(), []);

  return null;
}

export function useInputAction(
  action: InputAction,
  phase: InputPhase,
  handler: InputActionHandler,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    return inputManager.subscribe(action, phase, handler);
  }, [action, enabled, handler, phase]);
}
