import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-sso-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align: center; margin-top: 50px; color: white;">
      <h2>Verificando sesión con WordPress...</h2>
      <p>Espera un momento, por favor.</p>
    </div>
  `
})
export class SsoCallback implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone // Inyectamos NgZone para asegurar la navegación
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];

      // 1. Validamos que el código exista y sea válido
      if (code && !code.includes('<?php')) {
        console.log('🔑 Código detectado, iniciando validación...');
        this.procesarLoginSso(code);
      } else {
        if (code?.includes('<?php')) {
          console.warn('⚠️ Se detectó código PHP literal en la URL. Abortando SSO.');
        } else {
          console.error('❌ No se encontró el código de sesión en la URL.');
        }
        this.redigirAIntro();
      }
    });
  }

  procesarLoginSso(code: string) {
    this.authService.loginWithSso(code).subscribe({
      next: (response) => {
        console.log('✅ Login SSO exitoso. Roles y tokens actualizados.');
        
        this.ngZone.run(() => {
          // Navegamos a la pantalla de inicio dentro del iframe
          this.router.navigate(['/inicio'], { replaceUrl: true });
        });
      },
      error: (err) => {
        console.error('❌ Error en el intercambio de token SSO contra el backend:', err);
        this.redigirAIntro();
      }
    });
  }

  private redigirAIntro() {
    this.ngZone.run(() => {
      this.router.navigate(['/intro'], { replaceUrl: true });
    });
  }
}