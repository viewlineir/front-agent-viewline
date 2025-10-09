import { Routes } from '@angular/router';

export const AuthRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./auth.component').then(c => c.AuthComponent),
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
            },
            {
                path: 'forget-password',
                loadChildren: () => import('./components/forget-pass/forget-pass.routes').then(r => r.ForgetPassRoutes)
            },
        ]
    }
];
