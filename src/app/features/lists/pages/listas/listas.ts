import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecipeListService } from '../../services/recipe-list.service';
import { AuthService } from '@features/auth/services/auth.service';
import { Spinner } from '@shared/components/spinner/spinner';
import { RecipeList } from '../../models/recipe-list.model';

@Component({
  selector: 'app-listas',
  imports: [CommonModule, FormsModule, RouterLink, Spinner],
  templateUrl: './listas.html',
  styleUrl: './listas.css'
})
export class Listas implements OnInit {
  listas: RecipeList[] = [];
  cargando = true;

  nuevoNombre = '';
  nuevaPublica = false;

  usuarioId!: number;

  constructor(
    private recipeListService: RecipeListService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuarioActual();
    if (!usuario) {
      return;
    }
    this.usuarioId = usuario.id;
    this.cargarListas();
  }

  cargarListas(): void {
    this.recipeListService.obtenerPorUsuario(this.usuarioId).subscribe({
      next: (datos) => {
        this.listas = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar listas:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  crearLista(): void {
    if (!this.nuevoNombre.trim()) {
      return;
    }

    this.recipeListService.crear({
      nombre: this.nuevoNombre,
      publica: this.nuevaPublica,
      propietario: { id: this.usuarioId }
    }).subscribe({
      next: () => {
        this.nuevoNombre = '';
        this.nuevaPublica = false;
        this.cargarListas();
      },
      error: (err) => console.error('Error al crear lista:', err)
    });
  }

  alternarVisibilidad(lista: RecipeList): void {
    this.recipeListService.actualizar(lista.id, {
      nombre: lista.nombre,
      publica: !lista.publica,
      propietario: { id: this.usuarioId }
    }).subscribe({
      next: () => this.cargarListas(),
      error: (err) => console.error('Error al cambiar visibilidad:', err)
    });
  }

  eliminarLista(lista: RecipeList): void {
    if (lista.esFavoritos) {
      return;
    }
    this.recipeListService.eliminar(lista.id).subscribe({
      next: () => this.cargarListas(),
      error: (err) => console.error('Error al eliminar lista:', err)
    });
  }
}