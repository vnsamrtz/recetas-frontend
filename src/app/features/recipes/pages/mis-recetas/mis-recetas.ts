import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '@features/auth/services/auth.service';
import { Recipe } from '../../models/recipe.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-recetas',
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-recetas.html',
  styleUrl: './mis-recetas.css'
})
export class MisRecetas implements OnInit {
  recetas: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.recipeService.obtenerMisRecetas().subscribe({
      next: (datos: Recipe[]) => {
        this.recetas = datos;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al cargar mis recetas:', error);
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}