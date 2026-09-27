import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '@features/auth/services/auth.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recetas',
  imports: [CommonModule],
  templateUrl: './recetas.html',
  styleUrl: './recetas.css'
})
export class Recetas implements OnInit {
  recetas: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.recipeService.obtenerPublicas().subscribe({
      next: (datos) => {
        this.recetas = datos;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar recetas:', error);
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}