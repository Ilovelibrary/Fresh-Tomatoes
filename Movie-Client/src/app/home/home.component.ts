import { Component, OnInit, Inject } from '@angular/core';
import { Movie } from '../shared/movie';
import { MovieService } from '../services/movie.service';
import { flyInOut } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
  '[@flyInOut]': 'true',
  'style': 'display: block;'
  },
  animations: [
    flyInOut()
  ]
})
export class HomeComponent implements OnInit {

  movies: Movie[];
  movieErrMess: string;

  constructor(private movieservice: MovieService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.movieservice.getFeaturedMovies()
       .subscribe(movies => this.movies = movies,
        errmess => this.movieErrMess = <any>errmess );
  }

}