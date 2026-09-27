import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-crear-receta',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './crear-receta.html',
  styleUrl: './crear-receta.css'
})
export class CrearReceta implements OnInit {
  form: FormGroup;
  error = '';
  enviando = false;
  modoEdicion = false;
  recetaId: number | null = null;

  prepHoras: number | null = null;
  prepMinutos: number | null = null;

  coccionHoras: number | null = null;
  coccionMinutos: number | null = null;

  reposoHoras: number | null = null;
  reposoMinutos: number | null = null;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      tiempoPreparacion: [null, Validators.min(1)],
      tiempoCoccion: [null, Validators.min(1)],
      tiempoReposo: [null, Validators.min(1)],
      raciones: [null, Validators.min(1)],
      dificultad: [''],
      publicada: [false]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.modoEdicion = true;
      this.recetaId = Number(idParam);

      this.recipeService.obtenerPorId(this.recetaId).subscribe({
        next: (receta) => {
          this.form.patchValue({
            titulo: receta.titulo,
            descripcion: receta.descripcion,
            tiempoPreparacion: receta.tiempoPreparacion,
            tiempoCoccion: receta.tiempoCoccion,
            tiempoReposo: receta.tiempoReposo,
            raciones: receta.raciones,
            dificultad: receta.dificultad,
            publicada: receta.publicada
          });

          const prep = this.minutosAHorasYMinutos(receta.tiempoPreparacion);
          this.prepHoras = prep.horas;
          this.prepMinutos = prep.minutos;

          const coccion = this.minutosAHorasYMinutos(receta.tiempoCoccion);
          this.coccionHoras = coccion.horas;
          this.coccionMinutos = coccion.minutos;

          const reposo = this.minutosAHorasYMinutos(receta.tiempoReposo);
          this.reposoHoras = reposo.horas;
          this.reposoMinutos = reposo.minutos;

          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al cargar la receta:', err);
          this.error = 'No se ha podido cargar la receta';
          this.cdr.detectChanges();
        }
      });
    }
  }

  private minutosAHorasYMinutos(totalMinutos: number | null): { horas: number | null; minutos: number | null } {
    if (totalMinutos === null || totalMinutos === undefined) {
      return { horas: null, minutos: null };
    }
    return {
      horas: Math.floor(totalMinutos / 60) || null,
      minutos: totalMinutos % 60 || null
    };
  }

  private combinarAMinutos(horas: number | null, minutos: number | null): number | null {
    const h = horas ?? 0;
    const m = minutos ?? 0;
    const total = h * 60 + m;
    return total > 0 ? total : null;
  }

  actualizarTiempoPreparacion(): void {
    this.form.get('tiempoPreparacion')?.setValue(this.combinarAMinutos(this.prepHoras, this.prepMinutos));
  }

  actualizarTiempoCoccion(): void {
    this.form.get('tiempoCoccion')?.setValue(this.combinarAMinutos(this.coccionHoras, this.coccionMinutos));
  }

  actualizarTiempoReposo(): void {
    this.form.get('tiempoReposo')?.setValue(this.combinarAMinutos(this.reposoHoras, this.reposoMinutos));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      if (this.form.get('titulo')?.invalid) {
        this.error = 'El título es obligatorio';
      } else {
        this.error = 'El tiempo de preparación, cocción, reposo y las raciones deben ser mayores que 0';
      }
      return;
    }

    this.enviando = true;
    this.error = '';

    if (this.modoEdicion && this.recetaId !== null) {
      this.recipeService.actualizar(this.recetaId, this.form.value).subscribe({
        next: (receta) => {
          this.router.navigate(['/recetas', receta.id]);
        },
        error: (err: any) => {
          console.error('Error al actualizar la receta:', err);
          this.error = 'No se ha podido actualizar la receta';
          this.enviando = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.recipeService.crear(this.form.value).subscribe({
        next: (receta) => {
          this.router.navigate(['/recetas', receta.id]);
        },
        error: (err: any) => {
          console.error('Error al crear la receta:', err);
          this.error = 'No se ha podido crear la receta';
          this.enviando = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/mis-recetas']);
  }
}