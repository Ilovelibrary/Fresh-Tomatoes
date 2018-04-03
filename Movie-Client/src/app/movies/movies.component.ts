
import { Component, OnInit, Inject } from '@angular/core';
import { Movie } from '../shared/movie';
import { MovieService } from '../services/movie.service';
import { flyInOut} from '../animations/app.animation';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut()
  ]
})
export class MoviesComponent implements OnInit {
  movies: Movie[];
  errMess: string;

  constructor(private movieService: MovieService,
    @Inject('BaseURL') private BaseURL) { }
  
  ngOnInit() {
    this.movieService.getMovies()
      .subscribe(movies => this.movies = movies,
        errmess => this.errMess = <any>errmess);
  }
}