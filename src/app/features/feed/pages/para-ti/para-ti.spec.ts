import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaTi } from './para-ti';

describe('ParaTi', () => {
  let component: ParaTi;
  let fixture: ComponentFixture<ParaTi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParaTi],
    }).compileComponents();

    fixture = TestBed.createComponent(ParaTi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
