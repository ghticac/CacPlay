import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule], 
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  
  menuAbierto = false; 
  podcastOpen = false;
  termino: string = ''; 

  constructor(
    private router: Router,
    public authService: AuthService
  ) {} 

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  togglePodcast() {
    this.podcastOpen = !this.podcastOpen;
  }

  onSearch() {
    if (this.termino.trim()) {
      this.router.navigate(['/buscar'], { queryParams: { q: this.termino } });
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/intro';
  }


  // Agregamos el estado para cambiar el ícono (expandir / comprimir)
esPantallaCompleta: boolean = false;

toggleFullScreen() {
  const doc = document as any;
  const docEl = document.documentElement as any;

  if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    // Entrar a pantalla completa
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen();
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    }
    this.esPantallaCompleta = true;
  } else {
    // Salir de pantalla completa
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    }
    this.esPantallaCompleta = false;
  }
}

}
