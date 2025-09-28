import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ProducersIntervals } from './components/producers-intervals/producers-intervals.component';
import { TopStudios } from './components/top-studios/top-studios.component';
import { WinnersByYear } from './components/winners-by-year/winners-by-year.component';
import { YearsMultipleWinners } from './components/years-multiple-winners/years-multiple-winners.component';
import { MovieService } from '../../core/services/movie.service';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MovieService', [
      'getMaxMinWinIntervalForProducers',
      'getStudiosWithWinCount',
      'getWinnersByYear',
      'getYearsWithMultipleWinners'
    ]);

    // Configure spy returns
    spy.getMaxMinWinIntervalForProducers.and.returnValue(of({ min: [], max: [] }));
    spy.getStudiosWithWinCount.and.returnValue(of({ studios: [] }));
    spy.getWinnersByYear.and.returnValue(of([]));
    spy.getYearsWithMultipleWinners.and.returnValue(of({ years: [] }));

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        ProducersIntervals,
        TopStudios,
        WinnersByYear,
        YearsMultipleWinners
      ],
      providers: [
        { provide: MovieService, useValue: spy }
      ]
    }).compileComponents();

    movieServiceSpy = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all dashboard components', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-producers-intervals')).toBeTruthy();
    expect(compiled.querySelector('app-top-studios')).toBeTruthy();
    expect(compiled.querySelector('app-winners-by-year')).toBeTruthy();
    expect(compiled.querySelector('app-years-multiple-winners')).toBeTruthy();
  });
});