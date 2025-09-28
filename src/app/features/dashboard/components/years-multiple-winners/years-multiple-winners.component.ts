import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, EMPTY, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { MovieService } from '../../../../core/services/movie.service';
import { YearsWithMultipleWinnersResponse } from '../../../../core/models/dashboard.model';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-years-multiple-winners',
  standalone: true,
  imports: [CommonModule, ErrorMessage, LoadingComponent],
  templateUrl: './years-multiple-winners.component.html'
})
export class YearsMultipleWinners implements OnDestroy {
  yearsData$!: Observable<YearsWithMultipleWinnersResponse>;
  loading = true;
  error = false;
  errorMessage = '';
  private subscription?: Subscription;

  constructor(private movieService: MovieService) {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadData(): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';
    
    this.yearsData$ = this.movieService.getYearsWithMultipleWinners().pipe(
      catchError((error) => {
        this.error = true;
        this.errorMessage = this.getErrorMessage(error);
        return EMPTY;
      }),
      finalize(() => {
        this.loading = false;
      })
    );

    // Force subscription to ensure Observable executes
    this.subscription?.unsubscribe();
    this.subscription = this.yearsData$.subscribe();
  }

  onRetry(): void {
    this.loadData();
  }

  private getErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.message) {
      return error.message;
    }
    if (error?.error?.detail) {
      return error.error.detail;
    }
    return 'Failed to load years with multiple winners data.';
  }
}
