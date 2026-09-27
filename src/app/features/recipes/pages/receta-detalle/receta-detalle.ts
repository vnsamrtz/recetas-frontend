import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { FavoriteService } from '../../services/favorite.service';
import { RecipeIngredientService } from '../../services/recipe-ingredient.service';
import { RecipeStepService } from '../../services/recipe-step.service';
import { RecipeListService } from '@features/lists/services/recipe-list.service';
import { RecipeListItemService } from '@features/lists/services/recipe-list-item.service';
import { AuthService } from '@features/auth/services/auth.service';
import { Spinner } from '@shared/components/spinner/spinner';
import { Recipe } from '../../models/recipe.model';
import { RecipeIngredient } from '../../models/recipe-ingredient.model';
import { RecipeStep } from '../../models/recipe-step.model';
import { RecipeList } from '@features/lists/models/recipe-list.model';

@Component({
  selector: 'app-receta-detalle',
  imports: [CommonModule, FormsModule, RouterLink, Spinner],
  templateUrl: './receta-detalle.html',
  styleUrl: './receta-detalle.css'
})
export class RecetaDetalle implements OnInit {
  receta: Recipe | null = null;
  cargando = true;
  error = '';
  esFavorita = false;

  ingredientes: RecipeIngredient[] = [];
  nuevaDescripcionIngrediente = '';

  pasos: RecipeStep[] = [];
  nuevaDescripcionPaso = '';

  misListas: RecipeList[] = [];
  listaSeleccionadaId: number | null = null;
  mensajeListas = '';

  recetaId!: number;
  miUsuarioId: number | null = null;

  constructor(
    private recipeService: RecipeService,
    private favoriteService: FavoriteService,
    private recipeIngredientService: RecipeIngredientService,
    private recipeStepService: RecipeStepService,
    private recipeListService: RecipeListService,
    private recipeListItemService: RecipeListItemService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const usuarioActual = this.authService.obtenerUsuarioActual();
this.miUsuarioId = usuarioActual ? usuarioActual.id : null;
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id === null) {
      this.error = 'Receta no encontrada';
      this.cargando = false;
      return;
    }

    this.recetaId = id;

    this.recipeService.obtenerPorId(id).subscribe({
      next: (datos: Recipe) => {
        this.receta = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar la receta:', err);
        this.error = 'No se ha podido cargar la receta';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });

    this.cargarIngredientes();
    this.cargarPasos();
    this.cargarMisListas();
  }

  cargarIngredientes(): void {
    this.recipeIngredientService.obtenerPorReceta(this.recetaId).subscribe({
      next: (datos: RecipeIngredient[]) => {
        this.ingredientes = datos;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar ingredientes:', err)
    });
  }

  cargarPasos(): void {
    this.recipeStepService.obtenerPorReceta(this.recetaId).subscribe({
      next: (datos: RecipeStep[]) => {
        this.pasos = datos;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar pasos:', err)
    });
  }

  cargarMisListas(): void {
    const usuario = this.authService.obtenerUsuarioActual();
    if (!usuario) {
      return;
    }

    this.recipeListService.obtenerPorUsuario(usuario.id).subscribe({
      next: (datos: RecipeList[]) => {
        this.misListas = datos;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar tus listas:', err)
    });
  }

  anadirAListaSeleccionada(): void {
    if (this.listaSeleccionadaId === null) {
      return;
    }

    this.recipeListItemService.anadirReceta(this.listaSeleccionadaId, this.recetaId).subscribe({
      next: () => {
        this.mensajeListas = 'Receta añadida a la lista.';
        this.listaSeleccionadaId = null;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al añadir a la lista:', err);
        this.mensajeListas = 'No se ha podido añadir a la lista.';
        this.cdr.detectChanges();
      }
    });
  }

anadirIngrediente(): void {
  if (!this.nuevaDescripcionIngrediente) {
    return;
  }

  this.recipeIngredientService.crear(this.recetaId, {
    descripcion: this.nuevaDescripcionIngrediente,
    orden: this.ingredientes.length + 1,
    receta: { id: this.recetaId }
  }).subscribe({
    next: () => {
      this.nuevaDescripcionIngrediente = '';
      this.cargarIngredientes();
    },
    error: (err: any) => console.error('Error al añadir ingrediente:', err)
  });
}

  eliminarIngrediente(id: number): void {
    this.recipeIngredientService.eliminar(this.recetaId, id).subscribe({
      next: () => this.cargarIngredientes(),
      error: (err: any) => console.error('Error al eliminar ingrediente:', err)
    });
  }

  anadirPaso(): void {
    if (!this.nuevaDescripcionPaso) {
      return;
    }

    this.recipeStepService.crear(this.recetaId, {
      numeroOrden: this.pasos.length + 1,
      descripcion: this.nuevaDescripcionPaso,
      receta: { id: this.recetaId }
    }).subscribe({
      next: () => {
        this.nuevaDescripcionPaso = '';
        this.cargarPasos();
      },
      error: (err: any) => console.error('Error al añadir paso:', err)
    });
  }

  eliminarPaso(id: number): void {
    this.recipeStepService.eliminar(this.recetaId, id).subscribe({
      next: () => this.cargarPasos(),
      error: (err: any) => console.error('Error al eliminar paso:', err)
    });
  }

  alternarFavorito(): void {
    if (!this.receta) {
      return;
    }

    if (this.esFavorita) {
      this.favoriteService.quitar(this.receta.id).subscribe({
        next: () => {
          this.esFavorita = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al quitar favorito:', err)
      });
    } else {
      this.favoriteService.marcar(this.receta.id).subscribe({
        next: () => {
          this.esFavorita = true;
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al marcar favorito:', err)
      });
    }
  }

  volver(): void {
    this.router.navigate(['/para-ti']);
  }

  eliminarReceta(): void {
    if (!this.receta) {
      return;
    }

    const confirmado = window.confirm(
      '¿Estás segura de que quieres eliminar esta receta? Esta acción no se puede deshacer.'
    );

    if (!confirmado) {
      return;
    }

    this.recipeService.eliminar(this.receta.id).subscribe({
      next: () => {
        this.router.navigate(['/mis-recetas']);
      },
      error: (err: any) => console.error('Error al eliminar la receta:', err)
    });
  }
}