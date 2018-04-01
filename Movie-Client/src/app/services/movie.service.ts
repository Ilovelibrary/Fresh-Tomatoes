import { Injectable } from '@angular/core';
import { Movie } from '../shared/movie';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

@Injectable()
export class MovieService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getMovies(): Observable<Movie[]> {
    return this.http.get(baseURL + 'movies')
                    .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  getMovie(id: string): Observable<Movie> {
    return  this.http.get(baseURL + 'movies/'+ id)
                    .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  getFeaturedMovies(): Observable<Movie[]> {
    return this.http.get(baseURL + 'movies?featured=true')
                    .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  getMovieIds(): Observable<String[] | any> {
    return this.getMovies()
      .map(movies => { return movies.map(movie => movie._id)})
      .catch(error => { return error; });
  }

  postComment(movieId: string, comment: any) {
    return this.http.post(baseURL + 'movies/' + movieId + '/comments', comment)
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
    
  }
}