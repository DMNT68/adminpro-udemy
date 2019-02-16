import { Hospital } from '../../models/hospital.model';
import { Component, OnInit } from '@angular/core';

import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
 
  constructor(public _hospitalSrevice: HospitalService, public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion
    .subscribe(() => this.cargarHospitales());
  }

  cargarHospitales() {

    this._hospitalSrevice.cargarHospitales()
    .subscribe(hospitales => this.hospitales = hospitales);
      
  }

  buscarHospital(termino: string) {

    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this._hospitalSrevice.buscarHospital(termino)
    .subscribe(hospitales => this.hospitales = hospitales);

  }

  guardarHopsital(hospital: Hospital) {

    this._hospitalSrevice.actualizarHospital(hospital)
    .subscribe(() => this.cargarHospitales());

  
  }

  borrarHospital(hospital: Hospital) {

      this._hospitalSrevice.borrarHospital(hospital._id)
      .subscribe(() => this.cargarHospitales());

  }

  crearHospital() {

    Swal.fire({
      title: 'Crear Hopital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Crear hospital',
      
    }).then((result) => {
      if (!result.value || result.value.length === 0) {
        return;
      }

      this._hospitalSrevice.crearHospital(result.value)
      .subscribe(() => this.cargarHospitales());
    });
  }

  actualizarImagen(hospital: Hospital) {
      this._modalUploadService.mostarMoldal('hospitales', hospital._id);
  }

}
