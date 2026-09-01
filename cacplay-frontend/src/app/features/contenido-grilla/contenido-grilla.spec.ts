import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { ContenidoGrilla } from './contenido-grilla';

describe('ContenidoGrilla', () => {
  let component: ContenidoGrilla;
  let fixture: ComponentFixture<ContenidoGrilla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenidoGrilla],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidoGrilla);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
