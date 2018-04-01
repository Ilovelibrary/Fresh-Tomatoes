import { Comment } from './comment';

export class Movie {
    _id: string;
    title: string;
    year: string;
    description: string;
    IMDbrating: string;
    urlPoster: string;
    urlTrailer: string; 
    comments: Comment[];
}