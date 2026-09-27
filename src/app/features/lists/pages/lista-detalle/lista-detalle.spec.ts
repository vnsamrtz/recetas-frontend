import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDetalle } from './lista-detalle';

describe('ListaDetalle', () => {
  let component: ListaDetalle;
  let fixture: ComponentFixture<ListaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
