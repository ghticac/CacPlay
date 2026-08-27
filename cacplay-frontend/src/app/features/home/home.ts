import { Component, OnInit, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home';
import { RouterModule, Router } from '@angular/router';
import { register } from 'swiper/element/bundle';

// Registrar componentes personalizados de Swiper (<swiper-container>)
register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  hero: any = null;
  novedades: any[] = [];
  eventos: any[] = [];
  podcasts: any[] = [];
  miLista: any[] = [];

  constructor(
    private homeService: HomeService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarContenido();
  }

  cargarContenido() {
    this.homeService.getHomeContent().subscribe({
      next: (data: any) => {
        this.hero = data.hero;
        
        console.log('--- DATOS CRUDOS DE NOVEDADES ---', data.novedades);
        if (data.novedades && data.novedades.length > 0) {
          console.log('--- PRIMER ITEM DE NOVEDADES ---', data.novedades[0]);
        }

        const novedadesCrudas = data.novedades || [];
        this.novedades = novedadesCrudas.filter((item: any) => {
          if (!item) return false;
          const tipo = item.tipo ? String(item.tipo).toLowerCase() : '';
          const categoria = item.categoria ? String(item.categoria).toLowerCase() : '';
          return tipo !== 'audio' && tipo !== 'podcast' && categoria !== 'podcast';
        });

        console.log('--- NOVEDADES FILTRADAS (RESULTADO) ---', this.novedades);

        this.eventos = data.eventos || [];
        this.podcasts = data.podcasts || [];
        this.actualizarMiLista();
        
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al obtener contenido:', err)
    });
  }

  // Método auxiliar para refrescar solo la fila de favoritos
  actualizarMiLista() {
    this.homeService.getMiLista().subscribe({
      next: (favs: any) => {
        this.miLista = Array.isArray(favs) ? favs : (favs.resultados || []);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al actualizar Mi Lista:', err)
    });
  }

  /**
   * 💖 AGREGAR/QUITAR DE FAVORITOS (Para el Hero)
   */
  toggleFavorito(item: any) {
    if (!item || !item.id) return;
    
    this.homeService.toggleFavorito(item.id).subscribe({
      next: (res: any) => {
        item.es_favorito = res.favorito;
        this.actualizarMiLista();
        console.log('Estado favorito Hero:', item.es_favorito);
      },
      error: (err: any) => {
        console.error('Error en Hero favorito:', err);
        alert('No fue posible agregar el contenido a Mi Lista');
      }
    });
  }

  /**
   * ⭐ CALIFICAR (Para actualizar votos en tiempo real)
   */
  calificar(item: any, puntuacion: number) {
    if (!item || !item.id) return;

    this.homeService.enviarCalificacion(item.id, puntuacion).subscribe({
      next: (res: any) => {
        item.rating_promedio = res.rating_promedio;
        item.total_votos = res.total_votos;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al calificar:', err);
        alert('No fue posible registrar tu calificación');
      }
    });
  }

  goToContent(item: any) {
    if (item && item.id) {
      this.router.navigate(['/contenido', item.id]);
    }
  }
}