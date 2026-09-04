import { Injectable, signal } from '@angular/core';

export type NotificationType = 'idle' | 'loading' | 'success' | 'error';

export interface ToastState {
  type: NotificationType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  state = signal<ToastState>({ type: 'idle', message: '' });

  showLoading(message = 'Processing request...'): void {
    this.state.set({ type: 'loading', message });
  }

  showSuccess(message: string, autoDismissMs = 3000): void {
    this.state.set({ type: 'success', message });
    this.autoDismiss(autoDismissMs);
  }

  showError(message: string, autoDismissMs = 4000): void {
    this.state.set({ type: 'error', message });
    this.autoDismiss(autoDismissMs);
  }

  clear(): void {
    this.state.set({ type: 'idle', message: '' });
  }

  private autoDismiss(delay: number): void {
    setTimeout(() => this.clear(), delay);
  }
}
