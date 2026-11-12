import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSub?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userSub = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    // Se o usuário estiver autenticado mas faltar nome completo, busca do backend
    if (this.authService.getToken() && (!this.currentUser?.first_name || !this.currentUser?.last_name)) {
      this.authService.fetchProfile().subscribe();
    }
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  get userName(): string {
    const user = this.currentUser || this.authService.getCurrentUser();
    if (!user) return 'Usuário';

    const first = (user.first_name || '').trim();
    const last = (user.last_name || '').trim();

    if (first && last) {
      return `${first} ${last}`;
    }
    if (first) return first;
    if (last) return last;
    if (user.email) {
      const emailPrefix = user.email.split('@')[0];
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    return 'Usuário';
  }

  get userInitials(): string {
    const user = this.currentUser || this.authService.getCurrentUser();
    if (!user) return 'U';

    const first = (user.first_name || '').trim();
    const last = (user.last_name || '').trim();

    if (first && last) {
      return `${first[0]}${last[0]}`.toUpperCase();
    }
    if (first) {
      return first.substring(0, Math.min(2, first.length)).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, Math.min(2, user.email.length)).toUpperCase();
    }
    return 'U';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
