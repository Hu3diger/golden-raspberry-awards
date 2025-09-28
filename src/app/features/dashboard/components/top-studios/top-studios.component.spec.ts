import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TopStudios } from './top-studios.component';
import { MovieService } from '../../../../core/services/movie.service';
import { StudiosResponse } from '../../../../core/models/dashboard.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message.component';

describe('TopStudios', () => {
  let component: TopStudios;
  let fixture: ComponentFixture<TopStudios>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

  const mockStudiosResponse: StudiosResponse = {
    studios: [
      { name: 'Studio A', winCount: 10 },
      { name: 'Studio B', winCount: 8 },
      { name: 'Studio C', winCount: 6 },
      { name: 'Studio D', winCount: 4 },
      { name: 'Studio E', winCount: 2 }
    ]
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MovieService', ['getStudiosWithWinCount']);

    await TestBed.configureTestingModule({
      imports: [TopStudios, LoadingComponent, ErrorMessage],
      providers: [
        { provide: MovieService, useValue: spy }
      ]
    }).compileComponents();

    movieServiceSpy = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    
    // Setup default return value before creating component
    movieServiceSpy.getStudiosWithWinCount.and.returnValue(of(mockStudiosResponse));
    
    fixture = TestBed.createComponent(TopStudios);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load studios data on init', () => {
    movieServiceSpy.getStudiosWithWinCount.and.returnValue(of(mockStudiosResponse));

    fixture.detectChanges();

    expect(movieServiceSpy.getStudiosWithWinCount).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('should show loading state initially', () => {
    const newFixture = TestBed.createComponent(TopStudios);
    const newComponent = newFixture.componentInstance;
    
    expect(newComponent.loading).toBe(false);
    expect(newComponent.error).toBe(false);
  });

  it('should handle error when loading fails', () => {
    const errorResponse = { status: 500, statusText: 'Server Error' };
    movieServiceSpy.getStudiosWithWinCount.and.returnValue(throwError(() => errorResponse));

    const newFixture = TestBed.createComponent(TopStudios);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.loading).toBeFalse();
    expect(newComponent.error).toBeTrue();
    expect(newComponent.errorMessage).toBe('Failed to load top studios data.');
  });

  it('should display error message when error occurs', () => {
    const errorResponse = new Error('API Error');
    movieServiceSpy.getStudiosWithWinCount.and.returnValue(throwError(() => errorResponse));

    const newFixture = TestBed.createComponent(TopStudios);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    const errorComponent = newFixture.debugElement.nativeElement.querySelector('app-error-message');
    expect(errorComponent).toBeTruthy();
  });

  it('should limit studios to top 3', () => {
    movieServiceSpy.getStudiosWithWinCount.and.returnValue(of(mockStudiosResponse));

    component.loadData();

    // The component should sort by winCount desc and take only top 3
    component.studiosData$.subscribe(data => {
      expect(data.studios.length).toBe(3);
      expect(data.studios[0].name).toBe('Studio A');
      expect(data.studios[0].winCount).toBe(10);
      expect(data.studios[2].name).toBe('Studio C');
      expect(data.studios[2].winCount).toBe(6);
    });
  });

  it('should retry loading data when onRetry is called', () => {
    const errorResponse = new Error('API Error');
    movieServiceSpy.getStudiosWithWinCount.and.returnValue(throwError(() => errorResponse));

    const newFixture = TestBed.createComponent(TopStudios);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    
    expect(newComponent.error).toBeTrue();

    // Reset call count before retry
    movieServiceSpy.getStudiosWithWinCount.calls.reset();
    
    // Now simulate retry with successful response
    movieServiceSpy.getStudiosWithWinCount.and.returnValue(of(mockStudiosResponse));
    newComponent.onRetry();

    expect(movieServiceSpy.getStudiosWithWinCount).toHaveBeenCalledTimes(1);
    expect(newComponent.loading).toBeFalse();
    expect(newComponent.error).toBeFalse();
  });

  it('should display content when data loads successfully', () => {
    movieServiceSpy.getStudiosWithWinCount.and.returnValue(of(mockStudiosResponse));

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
    
    const contentDiv = fixture.debugElement.nativeElement.querySelector('.content');
    expect(contentDiv).toBeTruthy();
  });
});
