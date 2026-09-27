import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '@features/auth/services/auth.service';
import { FollowService } from '../../services/follow.service';
import { BlockService } from '../../services/block.service';
import { Spinner } from '@shared/components/spinner/spinner';
import { UserProfile } from '../../models/user-profile.model';
import { SeguidoresModal } from '@shared/components/seguidores-modal/seguidores-modal';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule, Spinner, RouterLink, SeguidoresModal],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  perfil: UserProfile | null = null;
  cargando = true;
  error = '';
  siguiendo = false;
  procesandoFollow = false;
  mostrarModal = false;
  pestanaModal: 'seguidores' | 'seguidos' = 'seguidores';

  editandoBio = false;
  biografiaTexto = '';

  editandoNombre = false;
  nombreTexto = '';
  errorNombre = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private followService: FollowService,
    private blockService: BlockService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const usuarioActual = this.authService.obtenerUsuarioActual();

    if (!usuarioActual) {
      this.router.navigate(['/login']);
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    const usuarioId = idParam ? Number(idParam) : usuarioActual.id;

    this.profileService.obtenerPerfil(usuarioId).subscribe({
      next: (datos) => {
        this.perfil = datos;
        this.cargando = false;

        if (!datos.esPropio) {
          this.comprobarSiSigue(usuarioActual.id, usuarioId);
        } else {
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        this.error = 'No se ha podido cargar el perfil';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private comprobarSiSigue(miId: number, usuarioId: number): void {
    this.followService.obtenerSeguidos(miId).subscribe({
      next: (seguidos) => {
        this.siguiendo = seguidos.some((f) => f.seguido.id === usuarioId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al comprobar si sigues a este usuario:', err);
        this.cdr.detectChanges();
      }
    });
  }

  seguir(): void {
    if (!this.perfil || this.procesandoFollow) {
      return;
    }
    this.procesandoFollow = true;

    this.followService.seguir(this.perfil.id).subscribe({
      next: () => {
        this.siguiendo = true;
        this.perfil!.totalSeguidores++;
        this.procesandoFollow = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al seguir:', err);
        this.procesandoFollow = false;
        this.cdr.detectChanges();
      }
    });
  }

  dejarDeSeguir(): void {
    if (!this.perfil || this.procesandoFollow) {
      return;
    }
    this.procesandoFollow = true;

    this.followService.dejarDeSeguir(this.perfil.id).subscribe({
      next: () => {
        this.siguiendo = false;
        this.perfil!.totalSeguidores--;
        this.procesandoFollow = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al dejar de seguir:', err);
        this.procesandoFollow = false;
        this.cdr.detectChanges();
      }
    });
  }

  bloquear(): void {
    if (!this.perfil) {
      return;
    }

    this.blockService.bloquear(this.perfil.id).subscribe({
      next: () => {
        this.router.navigate(['/para-ti']);
      },
      error: (err) => {
        console.error('Error al bloquear:', err);
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  eliminarCuenta(): void {
    if (!this.perfil) {
      return;
    }

    const confirmado = window.confirm(
      '¿Estás segura de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
    );

    if (!confirmado) {
      return;
    }

    this.authService.eliminarCuenta(this.perfil.id).subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Error al eliminar la cuenta:', err)
    });
  }

  activarEdicionBio(): void {
    this.biografiaTexto = this.perfil?.biografia ?? '';
    this.editandoBio = true;
  }

  guardarBiografia(): void {
    if (!this.perfil) {
      return;
    }

    this.authService.actualizarBiografia(this.perfil.id, this.biografiaTexto).subscribe({
      next: () => {
        this.perfil!.biografia = this.biografiaTexto;
        this.editandoBio = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al guardar la biografía:', err)
    });
  }

  cancelarEdicionBio(): void {
    this.editandoBio = false;
  }

  activarEdicionNombre(): void {
    this.nombreTexto = this.perfil?.nombre ?? '';
    this.errorNombre = '';
    this.editandoNombre = true;
  }

  guardarNombre(): void {
    if (!this.perfil || !this.nombreTexto.trim()) {
      return;
    }

    this.authService.actualizarNombre(this.perfil.id, this.nombreTexto).subscribe({
      next: () => {
        this.perfil!.nombre = this.nombreTexto;
        this.editandoNombre = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorNombre = err.error?.message ?? 'No se ha podido cambiar el nombre';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarEdicionNombre(): void {
    this.editandoNombre = false;
  }

  abrirSeguidores(): void {
  this.pestanaModal = 'seguidores';
  this.mostrarModal = true;
}

abrirSeguidos(): void {
  this.pestanaModal = 'seguidos';
  this.mostrarModal = true;
}

cerrarModal(): void {
  this.mostrarModal = false;
}
}