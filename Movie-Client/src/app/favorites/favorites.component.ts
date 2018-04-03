import { Component, OnInit, Inject } from '@angular/core';
import { Favorite } from '../shared/favorite';
import { FavoriteService } from '../services/favorite.service';
import { flyInOut } from '../animations/app.animation';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut()
  ]
})
export class FavoritesComponent implements OnInit {

  favorites: Favorite;
  delete: boolean;
  errMess: string;

  constructor(private favoriteService: FavoriteService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.favoriteService.getFavorites()
      .subscribe(favorites => this.favorites = favorites,
        errmess => this.errMess = <any>errmess);
  }

  deleteFavorite(id: string) {
    console.log("Deleting Movie " + id);
    this.favoriteService.deleteFavorite(id)
      .subscribe(favorites => this.favorites = favorites,
        errmess => this.errMess = <any>errmess);
    this.delete = false;
  }

}
