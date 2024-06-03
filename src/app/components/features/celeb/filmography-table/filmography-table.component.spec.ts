import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmographyTableComponent } from './filmography-table.component';

describe('FilmographyTableComponent', () => {
  let component: FilmographyTableComponent;
  let fixture: ComponentFixture<FilmographyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilmographyTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilmographyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
