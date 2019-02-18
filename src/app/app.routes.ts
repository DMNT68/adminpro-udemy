import {RouterModule, Routes } from '@angular/router';

// login y register
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';

// shared
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuardGuard } from './services/guards/login-guard.guard';



const appRoutes: Routes = [
    {path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent},
    {path: '', component: PagesComponent, canActivate: [LoginGuardGuard], 
        loadChildren: './pages/pages.module#PagesModules'},
    {path: '**', component: NopagefoundComponent},
];

export const APP_ROUTES =  RouterModule.forRoot(appRoutes, {useHash: true});
