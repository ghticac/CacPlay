import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoPrivado } from './contenido-privado';

describe('ContenidoPrivado', () => {
  let component: ContenidoPrivado;
  let fixture: ComponentFixture<ContenidoPrivado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenidoPrivado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidoPrivado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
