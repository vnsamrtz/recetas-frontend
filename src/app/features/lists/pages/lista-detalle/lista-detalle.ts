import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { RecipeListItemService } from '../../services/recipe-list-item.service';
import { RecipeService } from '@features/recipes/services/recipe.service';
import { AuthService } from '@features/auth/services/auth.service';
import { Spinner } from '@shared/components/spinner/spinner';
import { RecipeListItem } from '../../models/recipe-list-item.model';
import { RecipeList } from '../../models/recipe-list.model';
import { Recipe } from '@features/recipes/models/recipe.model';

type CriterioOrden = 'manual' | 'fecha' | 'alfabetico-az' | 'alfabetico-za' | 'tiempo';

@Component({
  selector: 'app-lista-detalle',
  imports: [CommonModule, FormsModule, DragDropModule, Spinner],
  templateUrl: './lista-detalle.html',
  styleUrl: './lista-detalle.css'
})
export class ListaDetalle implements OnInit {
  lista: RecipeList | null = null;
  items: RecipeListItem[] = [];
  itemsOrdenados: RecipeListItem[] = [];
  cargando = true;

  misRecetas: Recipe[] = [];
  recetaSeleccionadaId: number | null = null;

  criterio: CriterioOrden = 'manual';

  listaId!: number;

  constructor(
    private recipeListItemService: RecipeListItemService,
    private recipeService: RecipeService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/listas']);
      return;
    }
    this.listaId = Number(idParam);

    this.recipeListItemService.obtenerLista(this.listaId).subscribe({
      next: (datos) => {
        this.lista = datos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar la lista:', err)
    });

    this.cargarItems();

    const usuario = this.authService.obtenerUsuarioActual();
    if (usuario) {
      this.recipeService.obtenerMisRecetas().subscribe({
        next: (datos) => {
          this.misRecetas = datos;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar tus recetas:', err)
      });
    }
  }

  cargarItems(): void {
    this.recipeListItemService.obtenerItems(this.listaId).subscribe({
      next: (datos) => {
        this.items = datos;
        this.aplicarOrden();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar recetas de la lista:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cambiarCriterio(): void {
    this.aplicarOrden();
    this.cdr.detectChanges();
  }

  private aplicarOrden(): void {
    const copia = [...this.items];

    switch (this.criterio) {
      case 'fecha':
        copia.sort((a, b) => new Date(b.fechaAgregado).getTime() - new Date(a.fechaAgregado).getTime());
        break;
      case 'alfabetico-az':
        copia.sort((a, b) => a.receta.titulo.localeCompare(b.receta.titulo));
        break;
      case 'alfabetico-za':
        copia.sort((a, b) => b.receta.titulo.localeCompare(a.receta.titulo));
        break;
      case 'tiempo':
        copia.sort((a, b) => (a.receta.tiempoPreparacion ?? 0) - (b.receta.tiempoPreparacion ?? 0));
        break;
      default:
        copia.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
    }

    this.itemsOrdenados = copia;
  }

  soltar(evento: CdkDragDrop<any[]>): void {
    if (this.criterio !== 'manual') {
      return;
    }

    moveItemInArray(this.itemsOrdenados, evento.previousIndex, evento.currentIndex);

    const idsEnOrden = this.itemsOrdenados.map((item) => item.id);

    this.recipeListItemService.reordenar(this.listaId, idsEnOrden).subscribe({
      next: () => this.cargarItems(),
      error: (err) => console.error('Error al reordenar:', err)
    });
  }

  anadirReceta(): void {
    if (this.recetaSeleccionadaId === null) {
      return;
    }

    this.recipeListItemService.anadirReceta(this.listaId, this.recetaSeleccionadaId).subscribe({
      next: () => {
        this.recetaSeleccionadaId = null;
        this.cargarItems();
      },
      error: (err) => console.error('Error al añadir receta a la lista:', err)
    });
  }

  quitarReceta(item: RecipeListItem): void {
    this.recipeListItemService.quitarReceta(item.id).subscribe({
      next: () => this.cargarItems(),
      error: (err) => console.error('Error al quitar receta de la lista:', err)
    });
  }

  volver(): void {
    this.router.navigate(['/listas']);
  }
}