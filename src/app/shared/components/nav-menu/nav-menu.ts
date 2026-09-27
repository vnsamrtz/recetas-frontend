import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'app-nav-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.html',
  styleUrl: './nav-menu.css'
})
export class NavMenu implements OnInit, OnDestroy {
  mostrarMenu = false;
  private suscripcion?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.actualizarVisibilidad();

    this.suscripcion = this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => {
        this.actualizarVisibilidad();
      });
  }

  ngOnDestroy(): void {
    this.suscripcion?.unsubscribe();
  }

  private actualizarVisibilidad(): void {
    this.mostrarMenu = this.authService.estaAutenticado();
    this.cdr.detectChanges();
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}