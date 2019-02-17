import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { HttpClientModule} from '@angular/common/http';

import { SettingsService, 
          SidebarService, 
          SharedService, 
          UsuarioService, 
          SubirArchivoService, 
          HospitalService,
          MedicoService,
          LoginGuardGuard,
          AdminGuard
        } from './service.index';

        
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SharedService,
    SidebarService,
    UsuarioService,
    SubirArchivoService,
    ModalUploadService,
    HospitalService,
    MedicoService,
    LoginGuardGuard,
    AdminGuard
  ]
})
export class ServiceModule { }
