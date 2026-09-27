import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeListService } from '@features/lists/services/recipe-list.service';
import { BlockService } from '../../services/block.service';
import { AuthService } from '@features/auth/services/auth.service';
import { RecipeList } from '@features/lists/models/recipe-list.model';
import { Block } from '../../models/block.model';

@Component({
  selector: 'app-configuracion',
  imports: [CommonModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css'
})
export class Configuracion implements OnInit {
  listas: RecipeList[] = [];
  bloqueados: Block[] = [];
  cargando = true;
  usuarioId!: number;

  constructor(
    private recipeListService: RecipeListService,
    private blockService: BlockService,
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
    this.cargarBloqueados();
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

  cargarBloqueados(): void {
    this.blockService.obtenerBloqueados().subscribe({
      next: (datos) => {
        this.bloqueados = datos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar bloqueados:', err)
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

  desbloquear(bloqueo: Block): void {
    this.blockService.desbloquear(bloqueo.bloqueado.id).subscribe({
      next: () => this.cargarBloqueados(),
      error: (err) => console.error('Error al desbloquear:', err)
    });
  }
}