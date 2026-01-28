export type Review = {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number;
  content: string;
};

export type Episode = {
  id: string;
  title: string;
  episodeNumber: number;
  duration: string;
  airDate: string;
  synopsis: string;
};

export type Season = {
  id: string;
  seasonNumber: number;
  episodes: Episode[];
};

export type Show = {
  id: string;
  title: string;
  year: string;
  genres: string[];
  rating: number;
  synopsis: string;
  posterId: string;
  backdropId: string;
  seasons: Season[];
  reviews: Review[];
};
