import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecipeService } from '@features/recipes/services/recipe.service';
import { ProfileService } from '@features/profile/services/profile.service';
import { Spinner } from '@shared/components/spinner/spinner';
import { Recipe } from '@features/recipes/models/recipe.model';

type Modo = 'recetas' | 'personas';

@Component({
  selector: 'app-para-ti',
  imports: [CommonModule, FormsModule, RouterLink, Spinner],
  templateUrl: './para-ti.html',
  styleUrl: './para-ti.css'
})
export class ParaTi implements OnInit {
  modo: Modo = 'recetas';

  recetas: Recipe[] = [];
  usuarios: any[] = [];
  cargando = true;

  terminoBusqueda = '';
  buscando = false;

  constructor(
    private recipeService: RecipeService,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarRecientes();
  }

  cambiarModo(nuevoModo: Modo): void {
    this.modo = nuevoModo;
    this.terminoBusqueda = '';
    this.buscando = false;
    this.usuarios = [];

    if (this.modo === 'recetas') {
      this.cargarRecientes();
    }
  }

  cargarRecientes(): void {
    this.cargando = true;
    this.recipeService.obtenerRecientes().subscribe({
      next: (datos) => {
        this.recetas = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar recetas recientes:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscar(): void {
    if (!this.terminoBusqueda.trim()) {
      this.buscando = false;
      if (this.modo === 'recetas') {
        this.cargarRecientes();
      } else {
        this.usuarios = [];
      }
      return;
    }

    this.buscando = true;

    if (this.modo === 'recetas') {
      this.recipeService.buscar(this.terminoBusqueda, null, '').subscribe({
        next: (datos) => {
          this.recetas = datos;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al buscar recetas:', err);
          this.cdr.detectChanges();
        }
      });
    } else {
      this.profileService.buscarUsuarios(this.terminoBusqueda).subscribe({
        next: (datos) => {
          this.usuarios = datos;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al buscar usuarios:', err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.buscando = false;

    if (this.modo === 'recetas') {
      this.cargarRecientes();
    } else {
      this.usuarios = [];
    }
  }
}