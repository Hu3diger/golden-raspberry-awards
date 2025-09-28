import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MoviesComponent } from './features/movies/movies.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'list', component: MoviesComponent },
  { path: '**', redirectTo: '' }
];
