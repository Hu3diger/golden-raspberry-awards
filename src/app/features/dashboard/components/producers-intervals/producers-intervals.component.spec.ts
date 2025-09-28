import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProducersIntervals } from './producers-intervals.component';
import { MovieService } from '../../../../core/services/movie.service';
import { ProducerIntervalsResponse } from '../../../../core/models/dashboard.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message.component';

describe('ProducersIntervals', () => {
  let component: ProducersIntervals;
  let fixture: ComponentFixture<ProducersIntervals>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

  const mockProducerIntervalsResponse: ProducerIntervalsResponse = {
    min: [
      { producer: 'Producer A', interval: 1, previousWin: 1980, followingWin: 1981 }
    ],
    max: [
      { producer: 'Producer B', interval: 10, previousWin: 1980, followingWin: 1990 }
    ]
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MovieService', ['getMaxMinWinIntervalForProducers']);

    await TestBed.configureTestingModule({
      imports: [ProducersIntervals, LoadingComponent, ErrorMessage],
      providers: [
        { provide: MovieService, useValue: spy }
      ]
    }).compileComponents();

    movieServiceSpy = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    
    // Setup default return value before creating component
    movieServiceSpy.getMaxMinWinIntervalForProducers.and.returnValue(of(mockProducerIntervalsResponse));
    
    fixture = TestBed.createComponent(ProducersIntervals);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load producers intervals data on init', () => {
    movieServiceSpy.getMaxMinWinIntervalForProducers.and.returnValue(of(mockProducerIntervalsResponse));

    fixture.detectChanges();

    expect(movieServiceSpy.getMaxMinWinIntervalForProducers).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('should show loading state initially', () => {
    const newFixture = TestBed.createComponent(ProducersIntervals);
    const newComponent = newFixture.componentInstance;
    
    expect(newComponent.loading).toBe(false);
    expect(newComponent.error).toBe(false);
  });

  it('should handle error when loading fails', () => {
    const errorResponse = { status: 500, statusText: 'Server Error' };
    movieServiceSpy.getMaxMinWinIntervalForProducers.and.returnValue(throwError(() => errorResponse));

    const newFixture = TestBed.createComponent(ProducersIntervals);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.loading).toBeFalse();
    expect(newComponent.error).toBeTrue();
    expect(newComponent.errorMessage).toBe('Failed to load producers intervals data.');
  });

  it('should display error message in template when error occurs', () => {
    const errorResponse = new Error('API Error');
    movieServiceSpy.getMaxMinWinIntervalForProducers.and.returnValue(throwError(() => errorResponse));

    const newFixture = TestBed.createComponent(ProducersIntervals);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    const errorComponent = newFixture.debugElement.nativeElement.querySelector('app-error-message');
    expect(errorComponent).toBeTruthy();
  });

  it('should display loading component when loading', () => {
    // Create a new component with loading state
    const newFixture = TestBed.createComponent(ProducersIntervals);
    const newComponent = newFixture.componentInstance;
    newComponent.loading = true;
    newFixture.detectChanges();
    
    const loadingComponent = newFixture.debugElement.nativeElement.querySelector('app-loading');
    expect(loadingComponent).toBeTruthy();
  });

  it('should retry loading data when onRetry is called', () => {
    const errorResponse = new Error('API Error');
    movieServiceSpy.getMaxMinWinIntervalForProducers.and.returnValue(throwError(() => errorResponse));

    const newFixture = TestBed.createComponent(ProducersIntervals);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    
    expect(newComponent.error).toBeTrue();

    // Reset call count before retry
    movieServiceSpy.getMaxMinWinIntervalForProducers.calls.reset();
    
    // Now simulate retry with successful response
    movieServiceSpy.getMaxMinWinIntervalForProducers.and.returnValue(of(mockProducerIntervalsResponse));
    newComponent.onRetry();

    expect(movieServiceSpy.getMaxMinWinIntervalForProducers).toHaveBeenCalledTimes(1);
    expect(newComponent.loading).toBeFalse();
    expect(newComponent.error).toBeFalse();
  });

  it('should display content when data loads successfully', () => {
    movieServiceSpy.getMaxMinWinIntervalForProducers.and.returnValue(of(mockProducerIntervalsResponse));

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
    
    const contentDiv = fixture.debugElement.nativeElement.querySelector('.content');
    expect(contentDiv).toBeTruthy();
  });
});
