import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, EMPTY, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { MovieService } from '../../../../core/services/movie.service';
import { WinnerByYear } from '../../../../core/models/dashboard.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-winners-by-year',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, ErrorMessage],
  templateUrl: './winners-by-year.component.html'
})
export class WinnersByYear implements OnInit, OnDestroy {
  selectedYear: number = new Date().getFullYear();
  winnersData$!: Observable<WinnerByYear[]>;
  loading = false;
  error = false;
  errorMessage = '';
  private subscription?: Subscription;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.searchWinners();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  searchWinners(): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.subscription?.unsubscribe();
    this.winnersData$ = this.movieService.getWinnersByYear(this.selectedYear).pipe(
      catchError((error) => {
        this.error = true;
        this.errorMessage = error?.error?.message || error?.message || 'Failed to load winners data';
        return EMPTY;
      }),
      finalize(() => {
        this.loading = false;
      })
    );

    // Force subscription to ensure Observable executes
    this.subscription = this.winnersData$.subscribe();
  }

  onRetry(): void {
    this.searchWinners();
  }
}
