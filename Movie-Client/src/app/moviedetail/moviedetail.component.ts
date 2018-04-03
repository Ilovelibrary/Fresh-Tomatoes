import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Movie } from '../shared/movie';
import { Comment } from '../shared/comment';
import { MovieService } from '../services/movie.service';
import { FavoriteService } from '../services/favorite.service';

import { LoginComponent } from '../login/login.component';

import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { visibility, flyInOut } from '../animations/app.animation';

@Component({
  selector: 'app-moviedetail',
  templateUrl: './moviedetail.component.html',
  styleUrls: ['./moviedetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility()
  ]
})
export class MoviedetailComponent implements OnInit {

  @ViewChild('cform') commentFormDirective;

  movie: Movie;
  movieIds: String[];
  prev: String;
  next: String;
  errMess: string;
  visibility = 'shown';
  favorite: boolean = false;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'comment': {
      'required': 'Comment is required.'
    }
  };

  commentForm: FormGroup;

  constructor(public dialog: MatDialog,
    public sanitizer: DomSanitizer,
    private movieservice: MovieService,
    private favoriteService: FavoriteService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {

    this.createForm();

    this.movieservice.getMovieIds().subscribe(movieIds => this.movieIds = movieIds);
    this.route.params
      .switchMap((params: Params) => { this.visibility = 'hidden'; return this.movieservice.getMovie(params['id']); })
      .subscribe(movie => { 
          this.movie = movie; 
          this.setPrevNext(movie._id); 
          this.visibility = 'shown';
          this.favoriteService.isFavorite(this.movie._id)
            .subscribe(resp => { console.log(resp); this.favorite = resp.exists; },
                err => console.log(err));
        },
        errmess => this.errMess = <any>errmess);
  }

  setPrevNext(movieId: String) {
    if(this.movieIds) {
      let index = this.movieIds.indexOf(movieId);
      this.prev = this.movieIds[(this.movieIds.length + index - 1)%this.movieIds.length];
      this.next = this.movieIds[(this.movieIds.length + index + 1)%this.movieIds.length];
    }
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating: 10,
      comment: ['', Validators.required]
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
    console.log(this.commentForm.value);
    this.movieservice.postComment(this.movie._id, this.commentForm.value)
      .subscribe(movie => this.movie = movie, errmess => 
          this.dialog.open(LoginComponent, {width: '500px', height: '450px'}));
    this.commentForm.reset({
      rating: 10,
      comment: ''
    });
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  handleFavorites() {
    if (!this.favorite) {
      this.favoriteService.postFavorite(this.movie._id)
        .subscribe(favorites => {
           console.log(favorites); this.favorite = true; 
          }, errmess => { 
          this.dialog.open(LoginComponent, {width: '500px', height: '450px'})}
        );
    }
    else {
      this.favoriteService.deleteFavorite(this.movie._id)
        .subscribe(favorites => { console.log(favorites); this.favorite = false; });
    }
  }


  playTrailer() {
    this.dialog.open(TrailerComponent, {
      data: {
        urlTrailer: this.movie.urlTrailer+"&autoplay=1"
      }
    });
  }
}


@Component({
  selector: 'trailer-dialog',
  templateUrl: './trailer.html',
})
export class TrailerComponent {
  constructor(public sanitizer: DomSanitizer, 
    @Inject(MAT_DIALOG_DATA) public data: any) {}
}