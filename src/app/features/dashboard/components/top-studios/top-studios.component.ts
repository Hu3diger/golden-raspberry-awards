import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, EMPTY, Subscription } from 'rxjs';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { MovieService } from '../../../../core/services/movie.service';
import { StudiosResponse } from '../../../../core/models/dashboard.model';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-top-studios',
  standalone: true,
  imports: [CommonModule, ErrorMessage, LoadingComponent],
  templateUrl: './top-studios.component.html'
})
export class TopStudios implements OnDestroy {
  studiosData$!: Observable<StudiosResponse>;
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
    
    this.studiosData$ = this.movieService.getStudiosWithWinCount().pipe(
      map(response => ({
        studios: response.studios
          .sort((a, b) => b.winCount - a.winCount)
          .slice(0, 3)
      })),
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
    this.subscription = this.studiosData$.subscribe();
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
    return 'Failed to load top studios data.';
  }
}
