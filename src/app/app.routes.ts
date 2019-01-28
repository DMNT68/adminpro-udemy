import {RouterModule, Routes } from '@angular/router';

// login y register
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';

// shared
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';



const appRoutes: Routes = [
    {path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent},
    {path: '**', component: NopagefoundComponent},
];

export const APP_ROUTES =  RouterModule.forRoot(appRoutes, {useHash: true});
