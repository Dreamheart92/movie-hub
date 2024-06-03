import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebDetailsPageComponent } from './celeb-details-page.component';

describe('CelebDetailsPageComponent', () => {
  let component: CelebDetailsPageComponent;
  let fixture: ComponentFixture<CelebDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CelebDetailsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CelebDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
