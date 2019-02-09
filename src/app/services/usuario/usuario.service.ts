import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Modelo
import { Usuario } from '../../models/usuario.model';

import { URL_SERVICIOS } from '../../config/config';

import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(public http: HttpClient, public router: Router, public _subirArchivoServices: SubirArchivoService) { 
    // console.log('Servicio de usuario listo');
    this.cargaStorage();
  }

  estaLogueado() {
    return(this.token.length > 5 ) ? true : false; 
  }

  cargaStorage() {

    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
    } else {
      this.token = '';
      this.usuario = null;
    }

  }

  guardarStorage(id: string, token: string, usuario: Usuario) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;

  }
  
  logout() {

    this.usuario = null;
    this.token = '';

    localStorage.removeItem('usuario');
    localStorage.removeItem('token');

    this.router.navigate(['/login']);

  }

  loginGoogle(token: string) {

    let url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token })
    .pipe(map((resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario);
      return true;
    }));

  }

  
  login(usuario: Usuario, recordar: boolean = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario)
    .pipe(map((resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario);
      return console.log(resp);
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

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    // let header = new HttpHeaders({
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'token': this.token
    // });
    // return this.http.put(url, usuario, {headers: header});
    url += '?token=' + this.token;
    return this.http.put(url, usuario).pipe(map((resp: any) => {
       let usuarioDB: Usuario = resp.usuario; 
      this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
      Swal.fire('Usuario actualizado', usuario.nombre, 'success');
      return true;
    }));
  }


  cambiarImagen(archivo: File , id: string) {
    this._subirArchivoServices.subirArhivo(archivo, 'usuarios', id)
    .then((resp: any) => {
      this.usuario.img = resp.usuario.img;
      Swal.fire('Imagen Actualizada', this.usuario.nombre, 'success');
      this.guardarStorage(id, this.token, this.usuario);
    })
    .catch(resp => {
      console.log(resp);
    });
  }

}
