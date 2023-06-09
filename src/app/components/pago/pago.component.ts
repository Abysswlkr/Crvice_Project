import {Component,OnInit} from '@angular/core';
import {IPayPalConfig,ICreateOrderRequest } from 'ngx-paypal';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Trabajo, User, userDataBank } from 'src/app/models/models';
import { Publicacion } from 'src/app/models/publicacion';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import axios from 'axios';
import { Location } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  public isLoading: boolean = false; // Variable para indicar si se está cargando información
  public payPalConfig?: IPayPalConfig; // Configuración de PayPal (opcional)
  public trabajo: Trabajo | undefined; // Variable para almacenar el trabajo
  public publicacion: Publicacion | undefined; // Variable para almacenar la publicación
  public datosBanco: userDataBank[] = []; // Arreglo de datos bancarios
  public uidTrabajador = ''; // ID del trabajador
  public rutTrabajador = ''; // Rut del trabajador
  public nombreTrabajador = ''; // Nombre del trabajador
  private precioUSD: number = 0; // Precio en dólares (privado)
  public paymentCancel = false; // Variable para indicar si se canceló el pago
  idCuentaTrans: string = ''; // ID de la cuenta de transferencia
  
  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private publicaciones: PublicacionesService,
    private router: Router,
    private location: Location,
    private firestoreA: FirebaseService
  ) {}


  ngOnInit(): void {
    this.isLoading = true;
    this.initConfig();

        // Obtener los parámetros de la URL
    this.route.queryParams.subscribe(params => {
        const trabajoId = params['trabajoId'];
        const publicacionId = params['publicacionId'];
    
        console.log('trabajoId:', trabajoId);
        console.log('publicacionId:', publicacionId);

          // Obtener información del trabajo
        this.firestore.collection<Trabajo>('Trabajos').doc(trabajoId).get().toPromise().then((trabajoDoc) => {
          if (trabajoDoc && trabajoDoc.exists) {
            this.trabajo = trabajoDoc.data() as Trabajo;
            if (this.trabajo && this.trabajo.precio) {
                const precio = Number(this.trabajo.precio.replace(/[^\d]/g, ''));
                console.log('Precio del trabajo en número:', precio);
                this.calcularPrecioUSD(precio);
                
              }
              
            // Obtener información del usuario
            this.firestore.collection<User>('Usuarios').doc(this.trabajo.idUsuarioPublicacion).get().toPromise().then((usuarioDoc) => {
              if (usuarioDoc && usuarioDoc.exists) {
                const usuario = usuarioDoc.data() as User;
                this.uidTrabajador = usuario.uid;
                this.rutTrabajador = usuario.rut + '-' + usuario.dv
                this.nombreTrabajador = usuario.nombre + ' ' + usuario.apellido;
                this.publicaciones.uidUsuario = usuario.uid;

              // Obtener datos bancarios del usuario
                const path = `Usuarios/${this.uidTrabajador}/DatosTransferencia`;
                this.firestoreA.getCollection<userDataBank>(path).subscribe(userDataBank => {
                  this.datosBanco = userDataBank;
                  if (this.datosBanco.length > 0) {
                    this.idCuentaTrans = this.datosBanco[0].IdCuenta; // Guardar el primer número de cuenta en idCuentaTrans
                  }
                });
              }
            });
          }
        });
    
        this.firestore.collection<Publicacion>('Publicaciones').doc(publicacionId).get().toPromise().then((publicacionDoc) => {
          if (publicacionDoc && publicacionDoc.exists) {
            this.publicacion = publicacionDoc.data() as Publicacion;
          }
        });
      });
    }

    // Calcular precio en Dolares
    calcularPrecioUSD(precioCLP: number): void {
      const porcentaje = 0.2; // 20% del precio
      const precio20Porciento = precioCLP * porcentaje;
      
      axios.get('https://api.exchangerate-api.com/v4/latest/CLP')
        .then(response => {
          const rate = response.data.rates.USD;
          console.log(`1 CLP equivale a ${rate} USD`);
          this.precioUSD = parseFloat((precio20Porciento * rate).toFixed(1));
          console.log('El precio del trabajo en USD es:', this.precioUSD);
        })
        .catch(error => {
          console.log(error);
        });
      
      this.isLoading = false;
    }
    
   // Calcular el precio al 20% del trabajo
    calcularPrecio20Porciento(precio: string): number {
      const precioCLP = Number(precio.replace(/[^\d]/g, ''));
      const porcentaje = 0.2; // 20% del precio
      const precio20Porciento = precioCLP * porcentaje;
      return precio20Porciento;
    }
    
    // Inicializar la configuración de PayPal
  private initConfig(): void {
      this.payPalConfig = {
          currency: 'USD',
          clientId: 'AcD-r91UFp5Xa_CPRk0k98qvOgggxb4O_LN85NH4MuIPK4_17d7lmxReQ0R-tg6Kl33aVcdR3kTGFp9G',
          createOrderOnClient: (data) => < ICreateOrderRequest > {
              intent: 'CAPTURE',
              purchase_units: [{
                  amount: {
                      currency_code: 'USD',
                      value: `${this.precioUSD}`, // Usar precioUSD como valor
                      breakdown: {
                          item_total: {
                              currency_code: 'USD',
                              value: `${this.precioUSD}`, // Usar precioUSD como valor
                          }
                      }
                  },
                  items: [{
                      name: 'Enterprise Subscription',
                      quantity: '1',
                      category: 'DIGITAL_GOODS',
                      unit_amount: {
                          currency_code: 'USD',
                          value: `${this.precioUSD}`, // Usar precioUSD como valor
                      },
                  }]
              }]
          },
          advanced: {
            commit: 'true',
            extraQueryParams: [
                { name: "disable-funding", value: "credit,card" }
            ]
        },
          style: {
              label: 'paypal',
              layout: 'vertical'
          },
          onApprove: (data, actions) => {
              console.log('onApprove - transaction was approved, but not authorized', data, actions);
              actions.order.get().then((details: any) => {
                  console.log('onApprove - you can get full order details inside onApprove: ', details);
              });

          },
          onClientAuthorization: (data) => {
              console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
          // Cambiar el estado de trabajo a Abonado
              this.changeWorkStatusToAbonado();

    // Volver a la página anterior
            this.location.back();


          },
          onCancel: (data, actions) => {
              console.log('OnCancel', data, actions);
              this.paymentCancel = true;
          },
          onError: err => {
              console.log('OnError', err);
          },
          onClick: (data, actions) => {
              console.log('onClick', data, actions);
          }
      };
  }

    // Pasar estado del trabajo a Abonado
  private changeWorkStatusToAbonado(): void {
    if (this.trabajo) {
      this.trabajo.estado = 'Abonado'; 
      const trabajoId = this.route.snapshot.queryParams['trabajoId'];
      this.firestore.collection<Trabajo>('Trabajos').doc(trabajoId).update(this.trabajo).then(() => {
        console.log('Trabajo actualizado con éxito');
      }).catch((error) => {
        console.error('Error al actualizar el trabajo:', error);
      });
    }
  }

    // Pasar estado del trabajo a Abonado con el metodo de transferencia
  public changeWorkStatusToAbonadoTransf(): void {
    if (this.trabajo) {
      this.trabajo.estado = 'Abonado'; 
      const trabajoId = this.route.snapshot.queryParams['trabajoId'];
      this.firestore.collection<Trabajo>('Trabajos').doc(trabajoId).update(this.trabajo).then(() => {
        console.log('Trabajo actualizado con éxito');
        this.location.back();
      }).catch((error) => {
        console.error('Error al actualizar el trabajo:', error);
      });
    }
  }
}






