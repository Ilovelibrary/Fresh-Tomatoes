import { Injectable } from '@angular/core';
import { Favorite } from '../shared/favorite';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable()
export class FavoriteService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getFavorites(): Observable<Favorite> {
    return this.http.get(baseURL + 'favorites')
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  postFavorites(movieids: any) {
    return this.http.post(baseURL + 'favorites/', movieids)
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  isFavorite(id: string) {
    return this.http.get(baseURL + 'favorites/' + id)
      .catch(error => { return this.processHTTPMsgService.handleError(error); });    
  }

  postFavorite(id: string) {
    return this.http.post(baseURL + 'favorites/' + id, {})
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }

  deleteFavorite(id: string) {
    return this.http.delete(baseURL + 'favorites/' + id)
      .catch(error => { return this.processHTTPMsgService.handleError(error); });
  }
}
