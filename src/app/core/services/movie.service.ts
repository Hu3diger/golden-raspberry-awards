import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Movie, MovieResponse, MovieFilters } from '../models/movies.model';
import {
  YearsWithMultipleWinnersResponse,
  StudiosResponse,
  ProducerIntervalsResponse,
  WinnerByYear,
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private apiService: ApiService) {}

  getMovies(
    page: number = 0,
    size: number = 10,
    filters?: MovieFilters
  ): Observable<MovieResponse> {
    const params: any = {
      page: page.toString(),
      size: size.toString(),
    };

    if (filters) {
      if (filters.year !== null && filters.year !== undefined) {
        params.year = filters.year.toString();
      }
      if (filters.winner !== null && filters.winner !== undefined) {
        params.winner = filters.winner.toString();
      }
    }

    return this.apiService
      .get<MovieResponse>('', params);
  }

  getYearsWithMultipleWinners(): Observable<YearsWithMultipleWinnersResponse> {
    return this.apiService
      .get<YearsWithMultipleWinnersResponse>('/yearsWithMultipleWinners');
  }

  getStudiosWithWinCount(): Observable<StudiosResponse> {
    return this.apiService
      .get<StudiosResponse>('/studiosWithWinCount');
  }

  getMaxMinWinIntervalForProducers(): Observable<ProducerIntervalsResponse> {
    return this.apiService
      .get<ProducerIntervalsResponse>('/maxMinWinIntervalForProducers');
  }

  getWinnersByYear(year: number): Observable<WinnerByYear[]> {
    const params = { 
      year: year.toString() 
    };
    
    return this.apiService
      .get<WinnerByYear[]>('/winnersByYear', params);
  }
}
