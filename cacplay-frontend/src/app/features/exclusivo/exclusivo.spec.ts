import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { Exclusivo } from './exclusivo';

describe('Exclusivo', () => {
  let component: Exclusivo;
  let fixture: ComponentFixture<Exclusivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exclusivo],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exclusivo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
