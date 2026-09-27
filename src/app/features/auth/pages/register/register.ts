import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  nombre = '';
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';

    this.authService.register({ nombre: this.nombre, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/para-ti']);
      },
      error: (err) => {
  if (err.error?.errores) {
    const primerError = Object.values(err.error.errores)[0];
    this.error = primerError as string;
  } else {
    this.error = err.error?.message ?? 'No se ha podido completar el registro';
  }
}
    });
  }
}