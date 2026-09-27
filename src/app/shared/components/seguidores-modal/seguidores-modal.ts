import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FollowService } from '@features/profile/services/follow.service';
import { AuthService } from '@features/auth/services/auth.service';
import { Follow } from '@features/profile/models/follow.model';

type Pestana = 'seguidores' | 'seguidos';

@Component({
  selector: 'app-seguidores-modal',
  imports: [CommonModule, RouterLink],
  templateUrl: './seguidores-modal.html',
  styleUrl: './seguidores-modal.css'
})
export class SeguidoresModal implements OnChanges {
  @Input() usuarioId!: number;
  @Input() pestanaInicial: Pestana = 'seguidores';
  @Output() cerrar = new EventEmitter<void>();

  pestana: Pestana = 'seguidores';
  seguidores: Follow[] = [];
  seguidos: Follow[] = [];
  misSeguidos: Follow[] = [];
  cargando = true;

  miId!: number;

  constructor(
    private followService: FollowService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    this.pestana = this.pestanaInicial;
    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario) {
      this.miId = usuario.id;
    }
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    this.followService.obtenerSeguidores(this.usuarioId).subscribe({
      next: (datos) => {
        this.seguidores = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar seguidores:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });

    this.followService.obtenerSeguidos(this.usuarioId).subscribe({
      next: (datos) => {
        this.seguidos = datos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar seguidos:', err)
    });

    if (this.miId) {
      this.followService.obtenerSeguidos(this.miId).subscribe({
        next: (datos) => {
          this.misSeguidos = datos;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar mis seguidos:', err)
      });
    }
  }

  cambiarPestana(nueva: Pestana): void {
    this.pestana = nueva;
  }

  yoLeSigo(usuarioId: number): boolean {
    return this.misSeguidos.some((f) => f.seguido.id === usuarioId);
  }

  seguir(usuarioId: number): void {
    this.followService.seguir(usuarioId).subscribe({
      next: () => this.cargarDatos(),
      error: (err) => console.error('Error al seguir:', err)
    });
  }

  dejarDeSeguir(usuarioId: number): void {
    this.followService.dejarDeSeguir(usuarioId).subscribe({
      next: () => this.cargarDatos(),
      error: (err) => console.error('Error al dejar de seguir:', err)
    });
  }

  eliminarSeguidor(seguidorId: number): void {
    this.followService.eliminarSeguidor(seguidorId).subscribe({
      next: () => this.cargarDatos(),
      error: (err) => console.error('Error al eliminar seguidor:', err)
    });
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }
}