import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.html'
})
export class Intro implements OnInit, AfterViewInit {
  
  videoActivo: boolean = true;

  // Capturamos el elemento #videoSplash del HTML
  @ViewChild('videoSplash') videoElement!: ElementRef<HTMLVideoElement>;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // Se ejecuta automáticamente cuando Angular termina de renderizar el DOM
  ngAfterViewInit(): void {
    if (this.videoElement && this.videoElement.nativeElement) {
      const video = this.videoElement.nativeElement;

      // Forzamos propiedades clave por código para saltar las restricciones de autoplay de los navegadores
      video.muted = true;
      video.playsInline = true;

      // Ejecutamos la reproducción controlando la promesa
      video.play()
        .then(() => {
          console.log("Autoplay iniciado correctamente.");
        })
        .catch(error => {
          console.warn("El navegador bloqueó el autoplay. Intentando reproducir tras el primer clic:", error);
          
          // Opcional: Escuchar un clic en el documento para reproducir si el navegador se pone muy pesado
          const mousePlay = () => {
            video.play().catch(err => console.log("Error al reproducir tras interacción:", err));
            document.removeEventListener('click', mousePlay);
          };
          document.addEventListener('click', mousePlay);
        });
    }
  }

  onVideoTerminado(): void {
    this.videoActivo = false;
    // Aquí puedes agregar lógica extra si quieres que al terminar mande a algún lado automáticamente
  }

  // 1. Redirección a la URL externa de inicio de sesión de CAC
  onLoginSso() {
    window.location.href = 'https://cuentadealtocosto.org/iniciar-sesion/'; 
  }

  // 2. Redirección al login interno de CACPlay para superadministradores
  onAdminLogin() {
    this.router.navigate(['/login']);
  }
}