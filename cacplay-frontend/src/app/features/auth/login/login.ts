import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      terms: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        // 💡 PUENTE TEMPORAL PARA PRUEBAS LOCALES: 
        // Forzamos el rol VIP si el correo pertenece a los dominios autorizados
        if (email.endsWith('@elevates.com.co') || email.endsWith('@cuentadealtocosto.org')) {
          localStorage.setItem('user_role', 'vip');
        }

        this.router.navigate(['/inicio']);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error en login:', error);
        this.errorMessage = 'Credenciales incorrectas';
        this.loading = false;
      }
    });
  }
}