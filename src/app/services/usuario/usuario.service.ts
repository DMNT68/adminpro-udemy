import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Modelo
import { Usuario } from '../../models/usuario.model';

import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

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
      this.menu = JSON.parse( localStorage.getItem('menu') );
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }

  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;

  }
  
  logout() {

    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);

  }

  loginGoogle(token: string) {

    let url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token })
    .pipe(map((resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
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
      this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    }),
    catchError(err => {
      Swal.fire('Error en el Login', err.error.mensaje, 'error');
      console.log(err.status);
      return throwError(err);
    }));
  }



  crearUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
    .pipe(map((resp: any) => {
      Swal.fire('Usuario Creado!', usuario.email, 'success');
      return resp.usuario;
    }),
    catchError(err => {
      Swal.fire(err.error.mensaje, err.error.err.message, 'error');
      console.log(err.status);
      return throwError(err);
    }));

  }
  
  // let header = new HttpHeaders({
  //   'Content-Type': 'application/json; charset=utf-8',
  //   'token': this.token
  // });
  // return this.http.put(url, usuario, {headers: header});


  actualizarUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(map((resp: any) => {
      
      if (usuario._id === this.usuario._id) {
        let usuarioDB: Usuario = resp.usuario; 
        this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
      }
      
      Swal.fire('Usuario actualizado', usuario.nombre, 'success');
      return true;

    }),
    catchError(err => {
      Swal.fire(err.error.mensaje, err.error.err.message, 'error');
      console.log(err.status);
      return throwError(err);
    }));

  }


  cambiarImagen(archivo: File , id: string) {

    this._subirArchivoServices.subirArhivo(archivo, 'usuarios', id)
    .then((resp: any) => {
      this.usuario.img = resp.usuario.img;
      Swal.fire('Imagen Actualizada', this.usuario.nombre, 'success');
      this.guardarStorage(id, this.token, this.usuario, this.menu);
    })
    .catch(resp => {
      console.log(resp);
    });
    
  }


  cargarUsuarios(desde: number = 0) {
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url).pipe(map((resp: any) => resp.usuarios));

  }

  borrarUsuario(id: string) {

    let url = URL_SERVICIOS + `/usuario/${id}?token=${this.token}`;
    return this.http.delete(url)
    .pipe(map(resp => {
      Swal.fire('Usuario Borrado!', 'El usuario ha sido borrado.', 'success');
      return true;
    }));

  }

}
