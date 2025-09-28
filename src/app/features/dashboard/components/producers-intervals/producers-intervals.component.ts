import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MovieService } from '../../../../core/services/movie.service';
import { ProducerIntervalsResponse } from '../../../../core/models/dashboard.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-producers-intervals',
  standalone: true,
  imports: [CommonModule, LoadingComponent, ErrorMessage],
  templateUrl: './producers-intervals.component.html'
})
export class ProducersIntervals {
  intervalsData$!: Observable<ProducerIntervalsResponse>;
  loading = true;
  error = false;
  errorMessage = '';

  constructor(private movieService: MovieService) {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';
    
    this.intervalsData$ = this.movieService.getMaxMinWinIntervalForProducers().pipe(
      catchError((error) => {
        this.error = true;
        this.errorMessage = error?.error?.message || error?.message || 'Failed to load producers intervals data.';
        this.loading = false;
        return EMPTY;
      })
    );
  
    this.intervalsData$.subscribe({
      next: () => this.loading = false,
      error: () => {}
    });
  }

  onRetry(): void {
    this.loadData();
  }
}
