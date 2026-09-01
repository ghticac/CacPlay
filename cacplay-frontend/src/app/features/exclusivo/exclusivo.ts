import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home';
import { ContenidoGrilla } from '../contenido-grilla/contenido-grilla'; 

@Component({
  selector: 'app-exclusivo',
  standalone: true,
  imports: [CommonModule, ContenidoGrilla],
  templateUrl: './exclusivo.html'
})
export class Exclusivo implements OnInit {
  listaExclusivo: any[] = [];
  cargando: boolean = true;

  constructor(
    private homeService: HomeService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargando = true;
    
    this.homeService.getExclusivo().subscribe({
      next: (data: any) => {
        // Soporta respuesta directa en array o respuesta paginada con .results / .exclusivo
        this.listaExclusivo = Array.isArray(data) ? data : (data.results || data.exclusivo || []);
        console.log('Contenidos exclusivos cargados:', this.listaExclusivo.length);
        
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar contenido exclusivo:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}