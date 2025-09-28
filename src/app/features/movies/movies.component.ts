import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, EMPTY } from 'rxjs';
import { switchMap, startWith, catchError, finalize } from 'rxjs/operators';
import { MovieService } from '../../core/services/movie.service';
import { MovieResponse, MovieFilters } from '../../core/models/movies.model';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ErrorMessage } from '../../shared/components/error-message/error-message.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ArrayJoinPipe } from '../../shared/pipes/array-join-pipe';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, ErrorMessage, PaginationComponent, ArrayJoinPipe],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit {
  movies$: Observable<MovieResponse>;
  loading = false;
  error = false;
  errorMessage = '';

  selectedYear: number | null = null;
  selectedWinner: boolean | null = null;

  private pageSubject = new BehaviorSubject<number>(0);
  private filtersSubject = new BehaviorSubject<MovieFilters>({});

  constructor(private movieService: MovieService) {
    this.movies$ = combineLatest([
      this.pageSubject,
      this.filtersSubject
    ]).pipe(
      switchMap(([page, filters]) => {
        this.loading = true;
        this.error = false;
        this.errorMessage = '';
        return this.movieService.getMovies(page, 10, filters).pipe(
          catchError((error) => {
            this.error = true;
            this.errorMessage = error?.error?.message || error?.message || 'Failed to load movies';
            this.loading = false;
            return EMPTY;
          }),
          finalize(() => {
            if (!this.error) {
              this.loading = false;
            }
          })
        );
      })
    );
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  applyFilters(): void {
    const filters: MovieFilters = {};
    if (this.selectedYear) filters.year = this.selectedYear;
    if (this.selectedWinner !== null) filters.winner = this.selectedWinner;
    
    this.filtersSubject.next(filters);
    this.pageSubject.next(0);
  }

  clearFilters(): void {
    this.selectedYear = null;
    this.selectedWinner = null;
    this.filtersSubject.next({});
    this.pageSubject.next(0);
  }

  onPageChange(page: number): void {
    this.pageSubject.next(page);
  }

  loadMovies(): void {
    this.applyFilters();
  }

  onRetry(): void {
    this.loadMovies();
  }
}