import type { TMDBShow, TMDBShowSummary, TMDBSeason, TMDBGenre } from '@/lib/types';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/';

let genreMap: Map<number, string> | null = null;

async function fetchGenres(): Promise<Map<number, string>> {
  if (genreMap) {
    return genreMap;
  }
  try {
    const data = await fetcher<{genres: TMDBGenre[]}>('genre/tv/list');
    genreMap = new Map(data.genres.map((genre) => [genre.id, genre.name]));
    return genreMap;
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    return new Map();
  }
}

export const getGenreName = async (id: number): Promise<string | undefined> => {
    const genres = await fetchGenres();
    return genres.get(id);
};

export const getGenreNames = async (ids: number[]): Promise<string[]> => {
    const genres = await fetchGenres();
    return ids.map(id => genres.get(id)).filter((name): name is string => !!name);
}

const fetcher = async <T>(path: string, params: Record<string, string> = {}): Promise<T> => {
  const url = new URL(`${API_BASE_URL}/${path}`);
  url.searchParams.append('api_key', API_KEY!);
  for (const key in params) {
    url.searchParams.append(key, params[key]);
  }
  
  const res = await fetch(url.toString());
  if (!res.ok) {
    const errorBody = await res.json();
    console.error('TMDB API Error:', errorBody);
    throw new Error(`Failed to fetch from TMDB: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
};

export const getPopularShows = async (page = 1): Promise<{results: TMDBShowSummary[]}> => {
  return fetcher('tv/popular', { page: String(page), language: 'en-US' });
};

export const searchShows = async (query: string, page = 1): Promise<{results: TMDBShowSummary[]}> => {
    if(!query) return getPopularShows(page);
    return fetcher('search/tv', { query, page: String(page), language: 'en-US' });
};

export const getShowById = async (id: string): Promise<TMDBShow> => {
  const show = await fetcher<TMDBShow>(`tv/${id}`, { append_to_response: 'reviews', language: 'en-US' });
  
  const seasonsWithEpisodes = await Promise.all(
    show.seasons.map(season => 
      fetcher<TMDBSeason>(`tv/${id}/season/${season.season_number}`, { language: 'en-US' })
    )
  );

  show.seasons = seasonsWithEpisodes;
  return show;
};

export const getShowsByTitle = async (titles: string[]): Promise<TMDBShowSummary[]> => {
    const searchPromises = titles.map(title => searchShows(title, 1));
    const searchResults = await Promise.all(searchPromises);
    const shows = searchResults.map(res => res.results[0]).filter(Boolean);
    return shows;
}


export const getImageUrl = (path: string | null, size: 'w200' | 'w300' | 'w400' | 'w500' | 'original' = 'w500') => {
  if (!path) {
    return `https://placehold.co/400x600/222/fff?text=${size.replace('w','')}%0AImage`;
  }
  return `${IMAGE_BASE_URL}${size}${path}`;
};
