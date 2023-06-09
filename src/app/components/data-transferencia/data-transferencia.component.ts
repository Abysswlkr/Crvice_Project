import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { userDataBank } from 'src/app/models/models';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-transferencia',
  templateUrl: './data-transferencia.component.html',
  styleUrls: ['./data-transferencia.component.css']
})
export class DataTransferenciaComponent implements OnInit {
  userDataForm: FormGroup; // Formulario de datos del usuario
  userData: userDataBank = { // Objeto para almacenar los datos del usuario
    idUsuarioCuenta: '',
    IdCuenta: '',
    NumCuenta: 0,
    TipoCuenta: '',
    Banco: '',
  };

  bancos = [ // Opciones de bancos para la selección
    'Banco de Chile',
    'Banco Estado',
    'Banco Santander',
    'Banco BCI',
    'Banco Itaú',
    'Banco Security',
    'Banco Falabella',
    'Banco Scotiabank',
    'Banco Coopeuch',
    'Banco Ripley'
  ];

  tipoCuenta = [ // Opciones de tipo de cuenta para la selección
    'Cuenta Vista',
    'Cuenta Corriente',
  ];

  uid: string = ''; // ID del usuario actual

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private toast: HotToastService,
    private router: Router
  ) {
    this.userDataForm = this.formBuilder.group({
      NumCuenta: ['', [Validators.required, Validators.pattern(/^\d{9,12}$/)]], // Campo del número de cuenta con validación de longitud
      TipoCuenta: ['', Validators.required], // Campo del tipo de cuenta requerido
      Banco: ['', Validators.required], // Campo del banco requerido
    });
  }

  ngOnInit(): void {
    // Obtener el ID del usuario actual
    this.firebaseService.getCurrentUserUid().subscribe((uid: string | null) => {
      if (uid) {
        this.uid = uid;
        console.log(this.uid);
      }
    });
  }

  //Método para guardar los datos de transferencia en Firebase.
  guardarDatos() {
    if (this.userDataForm.valid) {
      // Asignar los valores del formulario al objeto userData
      this.userData = {
        ...this.userDataForm.value,
        idUsuarioCuenta: this.uid
      };

      // Guardar los datos de transferencia en Firebase
      this.firebaseService.guardarDatosTransferencia(this.uid, this.userData)
        .then(() => {
          console.log('Datos guardados exitosamente');
          this.toast.success('Datos de tu cuenta de transferencias guardados correctamente!');
          this.router.navigate(['/profile']);
        })
        .catch((error: any) => {
          console.log('Error al guardar los datos:', error);
        });
    } else {
      // Mostrar mensaje de error si el formulario no es válido
      this.toast.error('Verifica los datos que ingresaste o ingresa datos válidos');
    }
  }
}
