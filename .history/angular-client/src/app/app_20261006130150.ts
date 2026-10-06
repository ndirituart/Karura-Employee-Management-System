import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { NotificationBannerComponent } from "./components/notification-banner/notification-banner.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Karura-Employees-MIS');

  constructor(public router: Router) {}

  get isLoginRoute() { return this.router.url.startsWith('/login'); }
}
