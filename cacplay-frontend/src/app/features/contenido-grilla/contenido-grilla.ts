import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home';

@Component({
  selector: 'app-contenido-grilla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contenido-grilla.html',
  styleUrl: './contenido-grilla.css'
})
export class ContenidoGrilla implements OnInit {
  
  @Input() titulo: string = '';
  @Input() contenidos: any[] = [];

  // Variables de paginación de 9 en 9
  paginaActual: number = 1;
  itemsPorPagina: number = 9;

  constructor(
    private router: Router, 
    private homeService: HomeService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {}

  // Obtiene los contenidos rebanados para la página activa
  get contenidosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.contenidos.slice(inicio, fin);
  }

  // Calcula el total de páginas necesarias
  get totalPaginas(): number {
    return Math.ceil(this.contenidos.length / this.itemsPorPagina);
  }

  // Genera un arreglo con los números de las páginas (ej: [1, 2, 3])
  get arrayPaginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cdr.detectChanges();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToContent(item: any) {
    if (item && item.id) {
      this.router.navigate(['/contenido', item.id]);
    }
  }

  toggleFavorito(event: Event, item: any) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Intentando toggleFavorito desde GRILLA para item:', item);

    if (!item || !item.id) {
        console.error('❌ Error en Grilla: El item no tiene ID o es nulo');
        return;
    }

    this.homeService.toggleFavorito(item.id).subscribe({
      next: (res: any) => {
        item.es_favorito = res.favorito !== undefined ? res.favorito : !item.es_favorito;
        this.cdr.detectChanges();
        console.log('✅ Estado actualizado en Grilla:', item.es_favorito);
        alert(item.es_favorito ? 'Agregado a Mi Lista' : 'Removido de Mi Lista');
      },
      error: (err: any) => {
        console.error('🔴 Error real en Grilla:', err);
        alert('No fue posible actualizar Mi Lista');
      }
    });
  }
}