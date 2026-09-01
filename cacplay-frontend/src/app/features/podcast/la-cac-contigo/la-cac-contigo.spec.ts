import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { LaCacContigo } from './la-cac-contigo';

describe('LaCacContigo', () => {
  let component: LaCacContigo;
  let fixture: ComponentFixture<LaCacContigo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaCacContigo],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaCacContigo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
