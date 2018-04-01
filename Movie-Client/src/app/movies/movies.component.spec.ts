import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MoviesComponent } from './movies.component';

import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Movie } from '../shared/movie';
import { MovieService } from '../services/movie.service';
import { MOVIES } from '../shared/movies';
import { baseURL } from '../shared/baseUrl';
import { Observable } from 'rxjs/Observable';

describe('MenuComponent', () => {
  let component: MovieComponent;
  let fixture: ComponentFixture<MovieComponent>;

  let movieServiceStub = {
    getMovies: function(): Observable<Movie[]> {
      return Observable.of(DISHES);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule,
        MaterialModule,
        FlexLayoutModule,
        RouterTestingModule.withRoutes(
          [ {path: 'menu', component: MenuComponent}]
        )],
      declarations: [ MenuComponent ],
      providers: [
        { provide: MovieService, useValue: dishServiceStub },
        { provide: 'BaseURL', useValue: baseURL }
      ]
    })
    .compileComponents();

    let dishService = TestBed.get(MovieService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dishes items should be 4', () => {
    expect(component.dishes.length).toBe(4);
    expect(component.dishes[1].name).toBe('Zucchipakoda');
    expect(component.dishes[3].featured).toBeFalsy();
  });

  it('should use dishes in the template', () => {
    fixture.detectChanges();

    let de: DebugElement;
    let el: HTMLElement;

    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;

    expect(el.textContent).toContain(DISHES[0].name.toUpperCase())
  });

});
