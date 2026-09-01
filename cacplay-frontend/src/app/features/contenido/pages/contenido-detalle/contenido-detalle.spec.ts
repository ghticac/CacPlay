import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { ContenidoDetalle } from './contenido-detalle';

describe('ContenidoDetalle', () => {
  let component: ContenidoDetalle;
  let fixture: ComponentFixture<ContenidoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenidoDetalle],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidoDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
