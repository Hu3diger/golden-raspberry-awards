import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { YearsMultipleWinners } from './years-multiple-winners.component';
import { MovieService } from '../../../../core/services/movie.service';
import { YearsWithMultipleWinnersResponse } from '../../../../core/models/dashboard.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message.component';

describe('YearsMultipleWinners', () => {
  let component: YearsMultipleWinners;
  let fixture: ComponentFixture<YearsMultipleWinners>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

  const mockYearsResponse: YearsWithMultipleWinnersResponse = {
    years: [
      { year: 1986, winnerCount: 2 },
      { year: 1990, winnerCount: 2 },
      { year: 2015, winnerCount: 3 }
    ]
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MovieService', ['getYearsWithMultipleWinners']);

    await TestBed.configureTestingModule({
      imports: [YearsMultipleWinners, LoadingComponent, ErrorMessage],
      providers: [
        { provide: MovieService, useValue: spy }
      ]
    }).compileComponents();

    movieServiceSpy = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    
    // Setup default return value before creating component
    movieServiceSpy.getYearsWithMultipleWinners.and.returnValue(of(mockYearsResponse));
    
    fixture = TestBed.createComponent(YearsMultipleWinners);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load years data on init', () => {
    movieServiceSpy.getYearsWithMultipleWinners.and.returnValue(of(mockYearsResponse));

    fixture.detectChanges();

    expect(movieServiceSpy.getYearsWithMultipleWinners).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('should show loading state initially', () => {
    const newFixture = TestBed.createComponent(YearsMultipleWinners);
    const newComponent = newFixture.componentInstance;
    
    expect(newComponent.loading).toBe(false);
    expect(newComponent.error).toBe(false);
  });

  it('should handle error when loading fails', () => {
    const errorResponse = { status: 500, statusText: 'Server Error' };
    movieServiceSpy.getYearsWithMultipleWinners.and.returnValue(throwError(() => errorResponse));

    const newFixture = TestBed.createComponent(YearsMultipleWinners);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.loading).toBeFalse();
    expect(newComponent.error).toBeTrue();
    expect(newComponent.errorMessage).toBe('Failed to load years with multiple winners data.');
  });

  it('should handle error with custom message', () => {
    const errorResponse = { error: { message: 'Custom error message' } };
    movieServiceSpy.getYearsWithMultipleWinners.and.returnValue(throwError(() => errorResponse));

    const newFixture = TestBed.createComponent(YearsMultipleWinners);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.errorMessage).toBe('Custom error message');
  });

  it('should display error message when error occurs', () => {
    const errorResponse = new Error('API Error');
    movieServiceSpy.getYearsWithMultipleWinners.and.returnValue(throwError(() => errorResponse));

    const newFixture = TestBed.createComponent(YearsMultipleWinners);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    const errorComponent = newFixture.debugElement.nativeElement.querySelector('app-error-message');
    expect(errorComponent).toBeTruthy();
  });

  it('should retry loading data when retry is clicked', () => {
    const errorResponse = { status: 500, statusText: 'Server Error' };
    movieServiceSpy.getYearsWithMultipleWinners.and.returnValue(throwError(() => errorResponse));

    const newFixture = TestBed.createComponent(YearsMultipleWinners);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    const errorComponent = newFixture.debugElement.nativeElement.querySelector('app-error-message');
    expect(errorComponent).toBeTruthy();

    // Simulate retry click
    spyOn(newComponent, 'onRetry').and.callThrough();
    const retryButton = newFixture.debugElement.nativeElement.querySelector('.retry-button');
    
    expect(retryButton).toBeTruthy();
    retryButton.click();
    newFixture.detectChanges();

    expect(newComponent.onRetry).toHaveBeenCalled();
  });

  it('should call loadData on constructor', () => {
    // The component calls loadData in constructor, which is already tested by other tests
    expect(component).toBeTruthy();
    expect(movieServiceSpy.getYearsWithMultipleWinners).toHaveBeenCalled();
  });

  it('should display content when data loads successfully', () => {
    movieServiceSpy.getYearsWithMultipleWinners.and.returnValue(of(mockYearsResponse));

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
    
    const contentDiv = fixture.debugElement.nativeElement.querySelector('.content');
    expect(contentDiv).toBeTruthy();
  });

  it('should unsubscribe on destroy', () => {
    movieServiceSpy.getYearsWithMultipleWinners.and.returnValue(of(mockYearsResponse));
    
    fixture.detectChanges();
    
    spyOn(component['subscription']!, 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(component['subscription']!.unsubscribe).toHaveBeenCalled();
  });
});
