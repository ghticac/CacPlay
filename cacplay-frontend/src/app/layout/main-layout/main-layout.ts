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
}