import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenidoGrilla } from '../../contenido-grilla/contenido-grilla';
import { HomeService } from '../../../services/home';


@Component({
  selector: 'app-del-libro-a-tu-oido',
  standalone: true,
  imports: [CommonModule, ContenidoGrilla],
  templateUrl: './del-libro-a-tu-oido.html',
  styleUrls: ['./del-libro-a-tu-oido.css']
})
export class DelLibroATuOido implements OnInit {

    episodios: any[] = [];
    cargando: boolean = true;

  constructor(private homeService: HomeService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.homeService.getHomeContent().subscribe({
      next: (data: any) => {
        // 1. Tomamos la base de datos
        const basePodcasts = data.podcasts || [];

        // 2. Filtramos por el campo técnico 'seccion'
        this.episodios = basePodcasts.filter((item: any) => 
          item.seccion === 'del_libro_a_tu_oido'
        );

        // Debug para confirmar
        console.log('Filtro por sección exitoso. Cantidad:', this.episodios.length);

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar episodios:', err);
        this.cargando = false;
      }
    });
  }

}