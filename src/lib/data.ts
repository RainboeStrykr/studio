import type { Show } from '@/lib/types';

export const shows: Show[] = [
  {
    id: 'starlight-odyssey',
    title: 'Starlight Odyssey',
    year: '2023',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: 4.8,
    synopsis:
      'The last remnants of humanity travel across the void of space in search of a new home, facing cosmic wonders and existential threats.',
    posterId: 'show-1-poster',
    backdropId: 'show-1-backdrop',
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        episodes: [
          { id: 'e101', episodeNumber: 1, title: 'The Exodus', duration: '58min', airDate: '2023-01-15', synopsis: 'The journey begins as the ark ship leaves a dying Earth.' },
          { id: 'e102', episodeNumber: 2, title: 'Whispers in the Dark', duration: '59min', airDate: '2023-01-22', synopsis: 'A mysterious signal leads the crew to a ghost ship.' },
        ],
      },
    ],
    reviews: [
        { id: 'r1', author: 'Alex', avatarUrl: 'avatar-1', rating: 5, content: 'A masterpiece of modern sci-fi! The visuals are stunning and the story is captivating.'},
        { id: 'r2', author: 'Maria', avatarUrl: 'avatar-2', rating: 4, content: 'Great start to the series. A bit slow at times, but the world-building is top-notch.'},
    ],
  },
  {
    id: 'cybernetic-city',
    title: 'Cybernetic City',
    year: '2024',
    genres: ['Cyberpunk', 'Thriller', 'Action'],
    rating: 4.5,
    synopsis:
      'In a neon-drenched metropolis, a cynical detective with a cybernetic arm uncovers a conspiracy that goes to the very top of the corporate ladder.',
    posterId: 'show-2-poster',
    backdropId: 'show-2-backdrop',
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        episodes: [
          { id: 'e101', episodeNumber: 1, title: 'Chrome and Rust', duration: '55min', airDate: '2024-03-10', synopsis: 'A high-profile murder case pulls Detective Kaito into the city\'s underbelly.' },
          { id: 'e102', episodeNumber: 2, title: 'Ghost in the Machine', duration: '56min', airDate: '2024-03-17', synopsis: 'The investigation reveals a rogue AI with a hidden agenda.' },
        ],
      },
    ],
    reviews: [
        { id: 'r1', author: 'David', avatarUrl: 'avatar-3', rating: 5, content: 'This is the cyberpunk show I\'ve been waiting for. Gritty, stylish, and smart.'},
    ],
  },
  {
    id: 'the-kings-decree',
    title: "The King's Decree",
    year: '2022',
    genres: ['Fantasy', 'Political', 'Drama'],
    rating: 4.9,
    synopsis:
      'In the kingdom of Eldoria, rival houses vie for power after the king\'s sudden death, threatening to plunge the realm into a brutal civil war.',
    posterId: 'show-3-poster',
    backdropId: 'show-3-backdrop',
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        episodes: [
          { id: 'e101', episodeNumber: 1, title: 'The Fallen Crown', duration: '62min', airDate: '2022-09-01', synopsis: 'The king is dead, and the game of thrones begins.' },
          { id: 'e102', episodeNumber: 2, title: 'A Web of Lies', duration: '65min', airDate: '2022-09-08', synopsis: 'Princess Anya navigates the treacherous court to protect her family.' },
        ],
      },
       {
        id: 's2',
        seasonNumber: 2,
        episodes: [
          { id: 'e201', episodeNumber: 1, title: 'The Dragon\'s Fury', duration: '63min', airDate: '2023-09-01', synopsis: 'War erupts on the western front.' },
        ],
      },
    ],
    reviews: [
        { id: 'r1', author: 'Sophia', avatarUrl: 'avatar-1', rating: 5, content: 'Absolutely brilliant. The political intrigue is as sharp as a Valyrian steel sword.'},
        { id: 'r2', author: 'Liam', avatarUrl: 'avatar-2', rating: 5, content: 'If you miss Game of Thrones, watch this now.'},
    ],
  },
   {
    id: 'baker-street-chronicles',
    title: 'Baker Street Chronicles',
    year: '2021',
    genres: ['Mystery', 'Crime', 'Period Drama'],
    rating: 4.6,
    synopsis:
      'A fresh take on the classic detective stories, following a young Sherlock Holmes and Dr. Watson as they solve their first cases in Victorian London.',
    posterId: 'show-4-poster',
    backdropId: 'show-4-backdrop',
    seasons: [],
    reviews: [],
  },
  {
    id: 'the-corner-office',
    title: 'The Corner Office',
    year: '2020',
    genres: ['Comedy', 'Sitcom'],
    rating: 4.2,
    synopsis:
      'A mockumentary-style sitcom about the quirky employees of a mid-level paper company, navigating the absurdity of corporate life.',
    posterId: 'show-5-poster',
    backdropId: 'show-5-backdrop',
    seasons: [],
    reviews: [],
  },
  {
    id: 'redwood-rangers',
    title: 'Redwood Rangers',
    year: '2023',
    genres: ['Adventure', 'Family', 'Action'],
    rating: 4.4,
    synopsis:
      'A group of kids in a small Oregon town discovers a hidden world of magic and mythical creatures in the vast forest behind their homes.',
    posterId: 'show-6-poster',
    backdropId: 'show-6-backdrop',
    seasons: [],
    reviews: [],
  },
   {
    id: 'quantum-entanglement',
    title: 'Quantum Entanglement',
    year: '2024',
    genres: ['Sci-Fi', 'Romance', 'Drama'],
    rating: 4.7,
    synopsis:
      'Two physicists discover they can communicate with their alternate-reality selves, leading to a complex romance that spans dimensions.',
    posterId: 'show-7-poster',
    backdropId: 'show-7-backdrop',
    seasons: [],
    reviews: [],
  },
   {
    id: 'the-last-stand',
    title: 'The Last Stand',
    year: '2022',
    genres: ['Western', 'Action', 'Drama'],
    rating: 4.3,
    synopsis:
      'A retired gunslinger is forced to pick up his six-shooter one last time to defend his town from a ruthless gang of outlaws.',
    posterId: 'show-8-poster',
    backdropId: 'show-8-backdrop',
    seasons: [],
    reviews: [],
  },
];

export const getShowById = (id: string | null) => shows.find((show) => show.id === id) || null;

export const searchShows = (query: string) => {
    if (!query) return shows;
    return shows.filter(show => 
        show.title.toLowerCase().includes(query.toLowerCase()) ||
        show.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
    );
}

export const getShowsByTitle = (titles: string[]) => {
    return shows.filter(show => titles.includes(show.title));
}
