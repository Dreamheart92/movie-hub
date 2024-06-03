import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvShowDetailsPageComponent } from './tv-show-details-page.component';

describe('TvShowDetailsPageComponent', () => {
  let component: TvShowDetailsPageComponent;
  let fixture: ComponentFixture<TvShowDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TvShowDetailsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TvShowDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
