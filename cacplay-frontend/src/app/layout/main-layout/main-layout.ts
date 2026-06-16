import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule], 
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  
  // 1. Variables de estado para los menús (Coincide exactamente con el HTML)
  menuAbierto = false; 
  podcastOpen = false; // Por si algún botón aún lo usa en el HTML

  // 2. Variable para capturar la búsqueda
  termino: string = ''; 

  constructor(private router: Router) {} 

  // 3. Control de los desplegables (Perfil/Mobile)
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  togglePodcast() {
    this.podcastOpen = !this.podcastOpen;
  }

  // 4. Lógica del Buscador
  onSearch() {
    if (this.termino.trim()) {
      // Navega a /buscar?q=...
      this.router.navigate(['/buscar'], { queryParams: { q: this.termino } });
    }
  }

  // 5. Salida segura
  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/intro';
  }
}