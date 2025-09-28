import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProducersIntervals } from './components/producers-intervals/producers-intervals.component';
import { TopStudios } from './components/top-studios/top-studios.component';
import { WinnersByYear } from './components/winners-by-year/winners-by-year.component';
import { YearsMultipleWinners } from './components/years-multiple-winners/years-multiple-winners.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProducersIntervals,
    TopStudios,
    WinnersByYear,
    YearsMultipleWinners
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  constructor() {}
}