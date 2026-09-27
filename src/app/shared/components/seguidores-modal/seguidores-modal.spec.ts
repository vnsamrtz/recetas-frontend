import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguidoresModal } from './seguidores-modal';

describe('SeguidoresModal', () => {
  let component: SeguidoresModal;
  let fixture: ComponentFixture<SeguidoresModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguidoresModal],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguidoresModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
