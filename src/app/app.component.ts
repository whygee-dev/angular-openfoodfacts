import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    protected readonly authService: AuthService,
    private readonly router: Router
  ) {}

  navItems: { name: string; link: string; onClick?: () => void }[] = [
    { name: 'Search', link: '/search' },
    { name: 'Scan', link: '/scan' },
    { name: 'History', link: '/history' },
  ];

  ngOnInit() {
    this.authService.getUser().then((user) => {
      if (user) {
        this.navItems.push({
          name: 'Logout',
          link: '/login',
          onClick: () => this.authService.logout(),
        });

        if (this.router.url === '/login' || this.router.url === '/register') {
          this.router.navigate(['/search']);
        }
      } else {
        this.navItems.push({ name: 'Login', link: '/login' });
      }
    });
  }
}
