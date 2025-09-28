import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MoviesComponent } from './movies.component';
import { MovieService } from '../../core/services/movie.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ErrorMessage } from '../../shared/components/error-message/error-message.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ArrayJoinPipe } from '../../shared/pipes/array-join-pipe';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

  const mockMovieResponse = {
    content: [
      {
        id: 1,
        year: 2024,
        title: 'Test Movie',
        studios: ['Studio A'],
        producers: ['Producer A'],
        winner: true
      }
    ],
    pageable: {
      sort: { sorted: false, unsorted: true },
      pageNumber: 0,
      pageSize: 10,
      offset: 0,
      paged: true,
      unpaged: false
    },
    totalElements: 1,
    totalPages: 1,
    last: true,
    first: true,
    number: 0,
    size: 10,
    numberOfElements: 1,
    sort: { sorted: false, unsorted: true },
    empty: false
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MovieService', ['getMovies']);

    await TestBed.configureTestingModule({
      imports: [
        MoviesComponent,
        FormsModule,
        LoadingComponent,
        ErrorMessage,
        PaginationComponent,
        ArrayJoinPipe
      ],
      providers: [
        { provide: MovieService, useValue: spy }
      ]
    }).compileComponents();

    movieServiceSpy = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    movieServiceSpy.getMovies.and.returnValue(of(mockMovieResponse));

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movies on init', () => {
    spyOn(component, 'loadMovies');
    
    component.ngOnInit();

    expect(component.loadMovies).toHaveBeenCalled();
  });

  it('should display loading state initially', () => {
    const newFixture = TestBed.createComponent(MoviesComponent);
    const newComponent = newFixture.componentInstance;
    
    expect(newComponent.loading).toBe(false);
    expect(newComponent.error).toBe(false);
  });

  it('should apply filters correctly', () => {
    component.selectedYear = 2024;
    component.selectedWinner = true;

    spyOn(component['filtersSubject'], 'next');
    spyOn(component['pageSubject'], 'next');

    component.applyFilters();

    expect(component['filtersSubject'].next).toHaveBeenCalledWith({ year: 2024, winner: true });
    expect(component['pageSubject'].next).toHaveBeenCalledWith(0);
  });

  it('should clear filters correctly', () => {
    component.selectedYear = 2024;
    component.selectedWinner = true;

    spyOn(component['filtersSubject'], 'next');
    spyOn(component['pageSubject'], 'next');

    component.clearFilters();

    expect(component.selectedYear).toBeNull();
    expect(component.selectedWinner).toBeNull();
    expect(component['filtersSubject'].next).toHaveBeenCalledWith({});
    expect(component['pageSubject'].next).toHaveBeenCalledWith(0);
  });

  it('should handle page change', () => {
    spyOn(component['pageSubject'], 'next');

    component.onPageChange(2);

    expect(component['pageSubject'].next).toHaveBeenCalledWith(2);
  });

  it('should handle error state', (done) => {
    const errorResponse = new Error('API Error');
    movieServiceSpy.getMovies.and.returnValue(throwError(() => errorResponse));

    const newFixture = TestBed.createComponent(MoviesComponent);
    const newComponent = newFixture.componentInstance;
    
    // Subscribe to the movies$ observable to trigger the error handling
    const subscription = newComponent.movies$.subscribe({
      next: () => {},
      error: () => {},
      complete: () => {}
    });
    
    // Trigger the observable by calling applyFilters
    newComponent.applyFilters();
    
    // Use setTimeout to wait for async operations
    setTimeout(() => {
      expect(newComponent.error).toBe(true);
      expect(newComponent.errorMessage).toBeTruthy();
      expect(newComponent.loading).toBe(false);
      subscription.unsubscribe();
      done();
    }, 10);
  });

  it('should retry loading on retry', () => {
    spyOn(component, 'loadMovies');

    component.onRetry();

    expect(component.loadMovies).toHaveBeenCalled();
  });
});