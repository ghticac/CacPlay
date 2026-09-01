import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exclusivo } from './exclusivo';

describe('Exclusivo', () => {
  let component: Exclusivo;
  let fixture: ComponentFixture<Exclusivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exclusivo]
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
