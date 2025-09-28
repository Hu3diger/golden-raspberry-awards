import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MovieService } from './movie.service';
import { ApiService } from './api.service';
import { 
  ProducerIntervalsResponse, 
  StudiosResponse, 
  YearsWithMultipleWinnersResponse, 
  WinnerByYear
} from '../models/dashboard.model';
import { MovieResponse, MovieFilters } from '../models/movies.model';

describe('MovieService', () => {
  let service: MovieService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        MovieService,
        { provide: ApiService, useValue: spy }
      ]
    });
    service = TestBed.inject(MovieService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMaxMinWinIntervalForProducers', () => {
    it('should return producers intervals data', () => {
      const mockResponse: ProducerIntervalsResponse = {
        min: [{ producer: 'Producer A', interval: 1, previousWin: 1980, followingWin: 1981 }],
        max: [{ producer: 'Producer B', interval: 10, previousWin: 1980, followingWin: 1990 }]
      };

      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getMaxMinWinIntervalForProducers().subscribe((response: ProducerIntervalsResponse) => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith('/maxMinWinIntervalForProducers');
    });

    it('should handle error in getMaxMinWinIntervalForProducers', () => {
      const error = new Error('API Error');
      apiServiceSpy.get.and.returnValue(throwError(() => error));

      service.getMaxMinWinIntervalForProducers().subscribe({
        next: () => fail('Expected error, but got success'),
        error: (err: any) => expect(err).toBe(error)
      });
    });
  });

  describe('getStudiosWithWinCount', () => {
    it('should return studios with win count data', () => {
      const mockResponse: StudiosResponse = {
        studios: [
          { name: 'Studio A', winCount: 5 },
          { name: 'Studio B', winCount: 3 }
        ]
      };

      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getStudiosWithWinCount().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith('/studiosWithWinCount');
    });
  });

  describe('getYearsWithMultipleWinners', () => {
    it('should return years with multiple winners data', () => {
      const mockResponse: YearsWithMultipleWinnersResponse = {
        years: [
          { year: 1986, winnerCount: 2 },
          { year: 1990, winnerCount: 2 }
        ]
      };

      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getYearsWithMultipleWinners().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith('/yearsWithMultipleWinners');
    });
  });

  describe('getWinnersByYear', () => {
    it('should return winners by year data', () => {
      const year = 1990;
      const mockResponse: WinnerByYear[] = [
        { id: 1, year: 1990, title: 'Movie A', studios: ['Studio A'], producers: ['Producer A'], winner: true },
        { id: 2, year: 1990, title: 'Movie B', studios: ['Studio B'], producers: ['Producer B'], winner: true }
      ];

      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getWinnersByYear(year).subscribe((response: WinnerByYear[]) => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith('/winnersByYear', { year: '1990' });
    });
  });

  describe('getMovies', () => {
    it('should return movies data without filters', () => {
      const mockResponse: MovieResponse = {
        content: [
          { id: 1, year: 1990, title: 'Movie A', studios: ['Studio A'], producers: ['Producer A'], winner: true }
        ],
        pageable: {
          sort: { sorted: false, unsorted: true },
          pageSize: 20,
          pageNumber: 0,
          offset: 0,
          paged: true,
          unpaged: false
        },
        totalElements: 1,
        last: false,
        totalPages: 1,
        first: true,
        sort: { sorted: false, unsorted: true },
        number: 0,
        numberOfElements: 1,
        size: 20
      };

      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getMovies().subscribe((response: MovieResponse) => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith('', { page: '0', size: '10' });
    });

    it('should return movies data with filters', () => {
      const filters: MovieFilters = {
        year: 1990,
        winner: true
      };

      const mockResponse: MovieResponse = {
        content: [
          { id: 1, year: 1990, title: 'Movie A', studios: ['Studio A'], producers: ['Producer A'], winner: true }
        ],
        pageable: {
          sort: { sorted: false, unsorted: true },
          pageSize: 10,
          pageNumber: 1,
          offset: 10,
          paged: true,
          unpaged: false
        },
        totalElements: 1,
        last: true,
        totalPages: 1,
        first: false,
        sort: { sorted: false, unsorted: true },
        number: 1,
        numberOfElements: 1,
        size: 10
      };

      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getMovies(1, 10, filters).subscribe((response: MovieResponse) => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith('', {
        page: '1',
        size: '10',
        year: '1990',
        winner: 'true'
      });
    });

    it('should handle filters with undefined values', () => {
      const filters: MovieFilters = {
        year: undefined,
        winner: undefined
      };

      const mockResponse: MovieResponse = {
        content: [],
        pageable: {
          sort: { sorted: false, unsorted: true },
          pageSize: 20,
          pageNumber: 0,
          offset: 0,
          paged: true,
          unpaged: false
        },
        totalElements: 0,
        last: true,
        totalPages: 0,
        first: true,
        sort: { sorted: false, unsorted: true },
        number: 0,
        numberOfElements: 0,
        size: 20
      };

      apiServiceSpy.get.and.returnValue(of(mockResponse));

      service.getMovies(0, 20, filters).subscribe((response: MovieResponse) => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.get).toHaveBeenCalledWith('', {
        page: '0',
        size: '20'
      });
    });
  });
});
