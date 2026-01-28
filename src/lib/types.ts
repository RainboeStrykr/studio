export type TMDBReview = {
  id: string;
  author: string;
  content: string;
  author_details: {
    rating: number | null;
    avatar_path: string | null;
  };
};

export type TMDBEpisode = {
  id: number;
  name: string;
  episode_number: number;
  overview: string;
  air_date: string;
  still_path: string | null;
  vote_average: number;
  season_number: number;
  runtime: number | null;
};

export type TMDBSeason = {
  id: number;
  name: string;
  season_number: number;
  episodes: TMDBEpisode[];
  air_date: string | null;
  poster_path: string | null;
  overview: string;
};

export interface TMDBGenre {
  id: number;
  name: string;
}

export type TMDBShow = {
  id: number;
  name: string;
  original_name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  first_air_date: string;
  genres: TMDBGenre[];
  seasons: TMDBSeason[];
  reviews: {
    results: TMDBReview[];
  };
};

export type TMDBShowSummary = {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
};

export type WatchlistShow = Pick<TMDBShowSummary, 'id' | 'name' | 'poster_path' | 'first_air_date' | 'vote_average'> & {
    genres: string[];
};

export type Review = {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number;
  content: string;
};
