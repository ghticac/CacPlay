import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // 🟢 RUTA DE BIENVENIDA (PÚBLICA)
  {
    path: 'intro',
    loadComponent: () =>
      import('./features/intro/intro').then(m => m.Intro)
  },

  {
    path: 'sso-callback',
    loadComponent: () => import('./features/sso-callback/sso-callback').then(m => m.SsoCallback)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.LoginComponent)
  },

  // 🔒 TODAS LAS RUTAS PROTEGIDAS BAJO EL LAYOUT PRINCIPAL
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/home/home').then(m => m.Home)
      },
      {
        path: 'novedades',
        loadComponent: () =>
          import('./features/novedades/novedades').then(m => m.Novedades)
      },
      {
        path: 'eventos',
        loadComponent: () =>
          import('./features/eventos/eventos').then(m => m.Eventos)
      },
      {
        path: 'mi-lista',
        loadComponent: () =>
          import('./features/mi-lista/mi-lista').then(m => m.MiLista)
      },
      {
        path: 'buscar',
        loadComponent: () =>
          import('./features/busqueda/busqueda').then(m => m.Busqueda)
      },
      {
        path: 'contenido/:id',
        loadComponent: () =>
          import('./features/contenido/contenido').then(m => m.Contenido)
      },
      // 🔒 NUEVA SECCIÓN PRIVADA (Solo para usuarios VIP)
      {
        path: 'exclusivo',
        loadComponent: () =>
          import('./features/exclusivo/exclusivo').then(m => m.Exclusivo)
      },
      {
        path: 'podcast/la-cac-contigo',
        loadComponent: () =>
          import('./features/podcast/la-cac-contigo/la-cac-contigo').then(m => m.LaCacContigo)
      },
      {
        path: 'podcast/del-libro-a-tu-oido',
        loadComponent: () =>
          import('./features/podcast/del-libro-a-tu-oido/del-libro-a-tu-oido').then(m => m.DelLibroATuOido)
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },

  // REDIRECCIÓN INICIAL: Si no hay ruta, intenta ir a inicio (el guard lo mandará a intro si no hay login)
  {
    path: '**',
    redirectTo: 'intro'
  }
];