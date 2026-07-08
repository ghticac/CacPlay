import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HomeService } from '../../services/home';

@Component({
  selector: 'app-contenido',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contenido.html',
  styleUrl: './contenido.css'
})
export class Contenido implements OnInit {

  contenido: any;
  embedUrl: SafeResourceUrl | null = null;
  tipoContenido: 'video' | 'audio' | null = null;
  relacionados: any[] = [];
  
  // Ajuste Punto 2: Control del límite de contenidos relacionados
  limiteRelacionados: number = 4;

  // Variables de calificación
  rating: number = 0;
  hoverRating: number = 0;
  showConfetti: boolean = false;
  confettiArray: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    public sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.rating = 0;
      this.hoverRating = 0;
      this.limiteRelacionados = 4; // Reinicia el límite al cambiar de contenido

      this.homeService.getContenidoById(id).subscribe((data: any) => {
        this.contenido = data.contenido;
        this.relacionados = data.relacionados;
        this.procesarContenido(this.contenido.url_externa);
        this.cdr.detectChanges();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // Ajuste Punto 2: Función para el evento clic del botón en el HTML
  mostrarMasRelacionados(): void {
    this.limiteRelacionados += 4;
    this.cdr.detectChanges();
  }

  procesarContenido(url: string) {
    if (!url) return;

    // 1. Lógica para YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      this.tipoContenido = 'video';
      const videoId = this.extractYoutubeId(url);
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoId}`
      );
    } 
    // 2. Lógica para Spotify
    else if (url.includes('spotify.com')) {
      this.tipoContenido = 'audio';
      let spotifyUrl = url;
      if (!spotifyUrl.includes('/embed/')) {
        spotifyUrl = spotifyUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
      }
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(spotifyUrl);
    }
    // 3. NUEVA Lógica para Cloudflare Stream
    else if (url.includes('videodelivery.net') || url.includes('cloudflarestream.com')) {
      this.tipoContenido = 'video';
      let cloudflareUrl = url;
      
      if (!cloudflareUrl.includes('/iframe')) {
        cloudflareUrl = cloudflareUrl.replace(/\/$/, '') + '/iframe';
      }
      
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(cloudflareUrl);
    }
  }

  extractYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  toggleFavorito() {
    console.log('Botón presionado. Estado actual de contenido:', this.contenido);

    if (!this.contenido) {
      console.error('❌ Error: this.contenido está vacío.');
      return;
    }

    if (!this.contenido.id) {
      console.error('❌ Error: El contenido no tiene ID:', this.contenido);
      return;
    }

    console.log('🚀 Enviando ID a favoritos:', this.contenido.id);

    this.homeService.toggleFavorito(this.contenido.id).subscribe({
      next: (res: any) => {
        this.contenido.es_favorito = res.favorito;
        this.cdr.detectChanges();
        console.log('✅ Éxito al actualizar favorito');
      },
      error: (err: any) => {
        console.error("🔴 Error real del servidor:", err);
        console.log("Status del error:", err.status); 
        alert('No fue posible agregar el contenido a Mi Lista');
      }
    });
  }

  setRating(value: number) {
    this.rating = value;
    this.homeService.enviarCalificacion(this.contenido.id, value).subscribe({
      next: (res: any) => {
        this.contenido.rating_promedio = res.rating_promedio;
        this.contenido.total_votos = res.total_votos;
        if (value === 5) this.triggerConfetti();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error al calificar:", err);
        alert('No fue posible registrar tu calificación');
      }
    });
  }

  setHover(value: number) { this.hoverRating = value; }
  clearHover() { this.hoverRating = 0; }

  triggerConfetti() {
    this.confettiArray = Array.from({ length: 80 }, () => Math.random() * 100);
    this.showConfetti = true;
    setTimeout(() => { this.showConfetti = false; }, 1500);
  }
}