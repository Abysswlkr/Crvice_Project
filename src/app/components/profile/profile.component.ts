import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  uid: string = ''
  info: User | null = null;

  nombre: string = '';
  apellido: string = '';
  rut: string = '';
  dv: string = '';
  correo: string = '';

  constructor(private auth: AuthService,
              private router: Router,
              private firestore: FirebaseService) {

  }

  async ngOnInit() {
    console.log('estoy en perfil')
    this.uid = (await this.auth.getUid()) || '';
    console.log('uid ->', this.uid);
    this.getInfoUser();
    this.auth.stateUser().subscribe(res => 
      console.log('en perfil - estado de autentificacion ->', res))
  }



  getInfoUser() {
    const path = 'Usuarios';
    const id = this.uid;
    this.firestore.getDoc<User>(path, id).subscribe( res => {
      if (res) {
        this.info = res;
      }
      console.log('datos son ->', res);
  })
  }

  mostrarPromptNombre() {
    const nombre = prompt("Por favor, ingrese un valor:");
    if (nombre != null) {
      console.log("El usuario ingresó el valor: " + nombre);
      const usuario = { nombre: nombre };
      this.saveNombre(usuario);
    }
  }

  mostrarPromptApellido() {
    const apellido = prompt("Por favor, ingrese un valor:");
    if (apellido != null) {
      console.log("El usuario ingresó el valor: " + apellido);
      const usuario = { apellido: apellido };
      this.saveApellido(usuario);
    }
  }


  saveNombre(usuario: any){
    const path = 'Usuarios';
    const id = this.uid;
    const updateDoc = {
      nombre: usuario.nombre
    };
    this.firestore.updateDoc(path, id, updateDoc).then( () => {
      console.log('actualizado con exito')
    })
  }

  saveApellido(usuario: any){
    const path = 'Usuarios';
    const id = this.uid;
    const updateDoc = {
      apellido: usuario.apellido
    };
    this.firestore.updateDoc(path, id, updateDoc).then( () => {
      console.log('actualizado con exito')
    })
  }

  async resetPassword() {
    const path = 'Usuarios';
    const id = this.uid;
    this.firestore.getDoc<User>(path, id).subscribe(res => {
      if (res) {
        this.info = res;
        if (this.info?.correo) {
          this.auth.resetPass(this.info.correo)
            .then(() => {
              // Email de recuperación de contraseña enviado
              console.log('Email de recuperación de contraseña enviado');
            })
            .catch((error) => {
              // Error al enviar el correo electrónico de recuperación de contraseña
              console.log('Error al enviar el correo electrónico de recuperación de contraseña', error);
            });
        }
      }
      console.log('datos son ->', res);
    });
  }


  logout() {
    this.auth.logout();
    console.log('se ha cerrado la sesion')
    this.router.navigate(['/login'])
  }


}
