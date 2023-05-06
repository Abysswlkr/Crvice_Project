import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Trabajo } from 'src/app/models/models';
import { Publicacion } from 'src/app/models/publicacion';
import { User } from 'src/app/models/models';
import { PublicacionesService } from 'src/app/services/publicaciones.service';

@Component({
  selector: 'app-resp-solicitud',
  templateUrl: './resp-solicitud.component.html',
  styleUrls: ['./resp-solicitud.component.css']
})
export class RespSolicitudComponent implements OnInit {
  public trabajo: Trabajo | undefined;
  public publicacion: Publicacion | undefined;
  public nombreUsuarioSolicitante = '';
  public mensajeTrabajador = '';
  public uidCliente = '';

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, private router: Router, private publicaciones: PublicacionesService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const trabajoId = params['trabajoId'];
      const publicacionId = params['publicacionId'];
  
      console.log('trabajoId:', trabajoId);
      console.log('publicacionId:', publicacionId);
  
      this.firestore.collection<Trabajo>('Trabajos').doc(trabajoId).get().toPromise().then((trabajoDoc) => {
        if (trabajoDoc && trabajoDoc.exists) {
          this.trabajo = trabajoDoc.data() as Trabajo;
          this.firestore.collection<User>('Usuarios').doc(this.trabajo.idUsuarioSolicitante).get().toPromise().then((usuarioDoc) => {
            if (usuarioDoc && usuarioDoc.exists) {
              const usuario = usuarioDoc.data() as User;
              this.nombreUsuarioSolicitante = usuario.nombre + ' ' + usuario.apellido;
              this.publicaciones.uidUsuario = usuario.uid;
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

  actualizarTrabajo(): void {
    if (this.trabajo) {
      this.trabajo.mensajeTrabajador = this.mensajeTrabajador;
      this.trabajo.estado = 'Respondido'; // add this line to change the state to 'respondido'
      const trabajoId = this.route.snapshot.queryParams['trabajoId'];
      this.firestore.collection<Trabajo>('Trabajos').doc(trabajoId).update(this.trabajo).then(() => {
        console.log('Trabajo actualizado con éxito');
      }).catch((error) => {
        console.error('Error al actualizar el trabajo:', error);
      });
    }
  }  

  rechazarTrabajo(): void {
    if (this.trabajo) {
      this.trabajo.estado = 'Cancelado'; 
      const trabajoId = this.route.snapshot.queryParams['trabajoId'];
      this.firestore.collection<Trabajo>('Trabajos').doc(trabajoId).update(this.trabajo).then(() => {
        console.log('Trabajo actualizado con éxito');
      }).catch((error) => {
        console.error('Error al actualizar el trabajo:', error);
      });
    }
  }  

  completarTrabajo(): void {
    if (this.trabajo) {
      this.trabajo.estado = 'Completado'; 
      const trabajoId = this.route.snapshot.queryParams['trabajoId'];
      this.firestore.collection<Trabajo>('Trabajos').doc(trabajoId).update(this.trabajo).then(() => {
        console.log('Trabajo actualizado con éxito');
      }).catch((error) => {
        console.error('Error al actualizar el trabajo:', error);
      });
    }
    this.router.navigate(['/calificacion'])
  }  

  calificar() {
    this.router.navigate(['/calificacion'])
  }
}