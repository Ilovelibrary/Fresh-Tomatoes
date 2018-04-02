import { Routes } from '@angular/router';

import { AppComponent } from '../app.component';
import { MoviesComponent } from '../movies/movies.component';
import { MoviedetailComponent } from '../moviedetail/moviedetail.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HomeComponent } from '../home/home.component';
import { SignupComponent } from '../signup/signup.component';
import { FavoritesComponent } from '../favorites/favorites.component';

export const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: 'movies',     component: MoviesComponent },
  { path: 'favorites',     component: FavoritesComponent },
  { path: 'moviedetail/:id',     component: MoviedetailComponent },
  { path: 'signup',  component: SignupComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];