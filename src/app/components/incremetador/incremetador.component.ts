import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-incremetador',
  templateUrl: './incremetador.component.html',
  styles: []
})
export class IncremetadorComponent implements OnInit {
  
  @ViewChild('textProgress') textProgress: ElementRef;

  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() { 
    // console.log('Leyenda', this.leyenda);
    // console.log('Progreso', this.progreso);
  }

  ngOnInit() {
    // console.log('Leyenda', this.leyenda);
    // console.log('Progreso', this.progreso);
  }

  onChange(newValue: number) {

    // let elemtHtml: any = document.getElementsByName('progreso')[0];
    // console.log(elemtHtml.value);

    if ( newValue >= 100) {
      this.progreso = 100;
    } else if (newValue <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }

    // elemtHtml.value = this.progreso;
    this.textProgress.nativeElement.value = this.progreso;
    this.cambioValor.emit(this.progreso);
  }
  

  cambiarValor(valor) {
    if (this.progreso >= 100 && valor > 0) {
      this.progreso = 100;
      return;
    }
    if (this.progreso <= 0 && valor < 0) {
      this.progreso = 0;
      return;
    }
    this.progreso = this.progreso + valor;

    this.cambioValor.emit(this.progreso);
 
    this.textProgress.nativeElement.focus();
  }


}
