import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Modelo
import { Usuario } from '../../models/usuario.model';

import { URL_SERVICIOS } from '../../config/config';

import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;


  constructor(public http: HttpClient, public router: Router) { 
    console.log('Servicio de usuario listo');
    this.cargaStorage();
  }

  estaLogueado(){
    return(this.token.length > 5 )? true : false; 
  }

  cargaStorage() {
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id:string, token:string, usuario:Usuario){
    localStorage.setItem('id',id);
    localStorage.setItem('token',token);
    localStorage.setItem('id',JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }
  
  logout(){
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  loginGoogle(token: string){

    let url=URL_SERVICIOS + '/login/google';
    return this.http.post(url,{ token })
    .pipe(map((resp: any) =>{
      this.guardarStorage(resp.id,resp.token,resp.usuario);
      return true;
    }));
  }

  
  login(usuario:Usuario, recordar:boolean = false){

    if (recordar) {
      localStorage.setItem('email',usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url=URL_SERVICIOS + '/login';
    return this.http.post(url,usuario)
    .pipe(map((resp:any)=>{
      this.guardarStorage(resp.id,resp.token,resp.usuario);
      return true;
    }));
  }

  crearUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
    .pipe(map((resp: any) => {
      Swal.fire('Usuario Creado!', usuario.email, 'success');
      return resp.usuario;
    }));

  }

}
