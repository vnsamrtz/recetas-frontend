import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '@features/recipes/services/recipe.service';
import { CategoryService } from '@features/recipes/services/category.service';
import { Recipe } from '@features/recipes/models/recipe.model';
import { Category } from '@features/recipes/models/category.model';

@Component({
  selector: 'app-buscar',
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar.html',
  styleUrl: './buscar.css'
})
export class Buscar implements OnInit {
  titulo = '';
  categoriaId: number | null = null;
  dificultad = '';
  categorias: Category[] = [];
  resultados: Recipe[] = [];
  buscado = false;

  constructor(
    private recipeService: RecipeService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoryService.obtenerTodas().subscribe({
      next: (datos: Category[]) => {
        this.categorias = datos;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  buscar(): void {
    this.recipeService.buscar(this.titulo, this.categoriaId, this.dificultad).subscribe({
      next: (datos: Recipe[]) => {
        this.resultados = datos;
        this.buscado = true;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al buscar:', err);
        this.cdr.detectChanges();
      }
    });
  }
}