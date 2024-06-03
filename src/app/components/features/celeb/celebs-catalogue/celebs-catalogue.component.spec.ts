import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebsCatalogueComponent } from './celebs-catalogue.component';

describe('CelebsCatalogueComponent', () => {
  let component: CelebsCatalogueComponent;
  let fixture: ComponentFixture<CelebsCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CelebsCatalogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CelebsCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
