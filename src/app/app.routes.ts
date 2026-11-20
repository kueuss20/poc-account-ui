import { Routes } from '@angular/router';

export const routes: Routes = [

    {path: '', redirectTo: '/change-password', pathMatch: 'full'},
    {path: 'change-password', loadComponent: () => import('./account/change-password/change-password').then(m => m.ChangePassword)},
];
