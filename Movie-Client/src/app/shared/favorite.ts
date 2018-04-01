import { Movie } from './movie';
import { User } from './user';

export class Favorite {
    _id: string;
    user: User;
    movies: Movie[];
    createdAt: string;
    updatedAt: string;
}