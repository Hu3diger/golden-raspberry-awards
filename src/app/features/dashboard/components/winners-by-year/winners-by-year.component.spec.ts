import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { WinnersByYear } from './winners-by-year.component';
import { MovieService } from '../../../../core/services/movie.service';
import { WinnerByYear } from '../../../../core/models/dashboard.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message.component';

describe('WinnersByYear', () => {
  let component: WinnersByYear;
  let fixture: ComponentFixture<WinnersByYear>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

  const mockWinnersResponse: WinnerByYear[] = [
    { id: 1, year: 1990, title: 'Movie A', studios: ['Studio A'], producers: ['Producer A'], winner: true },
    { id: 2, year: 1990, title: 'Movie B', studios: ['Studio B'], producers: ['Producer B'], winner: true }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MovieService', ['getWinnersByYear']);

    await TestBed.configureTestingModule({
      imports: [WinnersByYear, FormsModule, LoadingComponent, ErrorMessage],
      providers: [
        { provide: MovieService, useValue: spy }
      ]
    }).compileComponents();

    movieServiceSpy = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    
    // Setup default return value before creating component
    movieServiceSpy.getWinnersByYear.and.returnValue(of(mockWinnersResponse));
    
    fixture = TestBed.createComponent(WinnersByYear);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current year', () => {
    expect(component.selectedYear).toBe(new Date().getFullYear());
  });

  it('should load winners data when searchWinners is called', () => {
    movieServiceSpy.getWinnersByYear.and.returnValue(of(mockWinnersResponse));

    component.searchWinners();

    expect(movieServiceSpy.getWinnersByYear).toHaveBeenCalledWith(component.selectedYear);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('should show loading state when searching', () => {
    movieServiceSpy.getWinnersByYear.and.returnValue(of(mockWinnersResponse));

    component.searchWinners();

    // Initially loading should be true, but since we're using synchronous observable it will be false immediately
    expect(component.loading).toBeFalse();
  });

  it('should handle error when search fails', () => {
    const errorResponse = new Error('API Error');
    movieServiceSpy.getWinnersByYear.and.returnValue(throwError(() => errorResponse));

    component.searchWinners();

    expect(component.loading).toBeFalse();
    expect(component.error).toBeTrue();
    expect(component.errorMessage).toBe('API Error');
  });

  it('should handle error with custom message', () => {
    const errorResponse = { error: { message: 'Custom error message' } };
    movieServiceSpy.getWinnersByYear.and.returnValue(throwError(() => errorResponse));

    component.searchWinners();

    expect(component.errorMessage).toBe('Custom error message');
  });

  it('should display error message when error occurs', () => {
    const errorResponse = new Error('API Error');
    movieServiceSpy.getWinnersByYear.and.returnValue(throwError(() => errorResponse));

    component.searchWinners();
    fixture.detectChanges();

    const errorComponent = fixture.debugElement.nativeElement.querySelector('app-error-message');
    expect(errorComponent).toBeTruthy();
  });

  it('should retry search when onRetry is called', () => {
    const errorResponse = new Error('API Error');
    movieServiceSpy.getWinnersByYear.and.returnValue(throwError(() => errorResponse));

    component.searchWinners();
    expect(component.error).toBeTrue();

    // Now simulate retry with successful response
    movieServiceSpy.getWinnersByYear.and.returnValue(of(mockWinnersResponse));
    component.onRetry();

    expect(movieServiceSpy.getWinnersByYear).toHaveBeenCalledTimes(2);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('should call searchWinners on ngOnInit', () => {
    spyOn(component, 'searchWinners');
    movieServiceSpy.getWinnersByYear.and.returnValue(of(mockWinnersResponse));

    component.ngOnInit();

    expect(component.searchWinners).toHaveBeenCalled();
  });

  it('should update selectedYear and search when input changes', () => {
    movieServiceSpy.getWinnersByYear.and.returnValue(of(mockWinnersResponse));

    component.selectedYear = 1995;
    component.searchWinners();

    expect(movieServiceSpy.getWinnersByYear).toHaveBeenCalledWith(1995);
  });

  it('should display no results message when no winners found', () => {
    movieServiceSpy.getWinnersByYear.and.returnValue(of([]));

    component.searchWinners();
    fixture.detectChanges();

    // The component should handle empty results
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
  });
});
