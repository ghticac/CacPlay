import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { DelLibroATuOido } from './del-libro-a-tu-oido';

describe('DelLibroATuOidoComponent', () => {
  let component: DelLibroATuOido;
  let fixture: ComponentFixture<DelLibroATuOido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelLibroATuOido],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelLibroATuOido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
