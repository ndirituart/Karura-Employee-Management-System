import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notifications.service';

@Component({
  selector: 'app-notification-banner',
  standalone: true,
  template: `
    @switch (notification.state().type) {
      @case ('loading') {
        <div class="banner blue">
          <i class="bi bi-arrow-repeat spin"></i>
          <span>{{ notification.state().message }}</span>
        </div>
      }
      @case ('success') {
        <div class="banner green">
          <i class="bi bi-check-circle-fill"></i>
          <span>{{ notification.state().message }}</span>
          <button class="close-btn" (click)="notification.clear()">×</button>
        </div>
      }
      @case ('error') {
        <div class="banner red">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <span>{{ notification.state().message }}</span>
          <button class="close-btn" (click)="notification.clear()">×</button>
        </div>
      }
    }
  `,
  styles: [`
    .banner {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      border-radius: 8px;
      color: #ffffff;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    }
    .blue { background-color: #0288d1; }  /* Loading is Blue */
    .green { background-color: #2e7d32; } /* Success is Green */
    .red { background-color: #d32f2f; }   /* Error is Red */

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      margin-left: 10px;
    }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } }
  `]
})
export class NotificationBannerComponent {
  notification = inject(NotificationService);
}
