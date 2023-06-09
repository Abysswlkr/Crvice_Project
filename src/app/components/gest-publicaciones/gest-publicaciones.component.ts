import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, switchMap } from 'rxjs/operators';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { User } from 'src/app/models/models';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-gest-publicaciones',
  templateUrl: './gest-publicaciones.component.html',
  styleUrls: ['./gest-publicaciones.component.css']
})
export class GestPublicacionesComponent implements OnInit {
  publicaciones!: Observable<any>; // Observable que contiene las publicaciones
  publicacionesFiltradas!: any[]; // Array para almacenar las publicaciones filtradas
  rutUsuario: string = ''; // Rut del usuario para filtrar publicaciones
  noHayPublicaciones: boolean = false; // Variable para verificar si no hay publicaciones
  mostrarPrompt: boolean = false; // Variable para controlar si se muestra el diálogo de eliminación
  publicacionSeleccionada: any; // Variable para almacenar la publicación seleccionada
  public idPublicacion: string = ''; // ID de la publicación para filtrar publicaciones

  constructor(
    private publicacionService: PublicacionesService, 
    private firestore: AngularFirestore, 
    private router: Router, 
    private toast: HotToastService ,
    private auth: AuthService,
    private firebase: FirebaseService,  ) { }

  async ngOnInit() {
    // Obtener las publicaciones y realizar operaciones adicionales
    this.publicaciones = this.publicacionService.getPublicaciones().pipe(
      switchMap(publicaciones => {
        // Mapear las publicaciones obtenidas y combinarlas con los datos de usuarios
        const observables = publicaciones.map((publicacion: any) => {
          return this.firestore.doc<User>(`Usuarios/${publicacion.uid}`).valueChanges().pipe(
            map(user => {
              const rut = user?.rut || ''; // Obtener rut del usuario o dejar vacío si no existe
              const dv = user?.dv || ''; // Obtener dígito verificador del usuario o dejar vacío si no existe
              return { ...publicacion, rut, dv };
            })
          );
        });
        return combineLatest(observables); // Combinar las observables de usuarios y publicaciones
      })
    );

    // Suscribirse a las publicaciones para actualizar el array de publicaciones filtradas
    this.publicaciones.subscribe(data => {
      this.publicacionesFiltradas = data;
    });
    await this.canActivate();

  }

  async canActivate(): Promise<boolean> {
    const uid = await this.auth.getUid();
    if (uid) {
      const userProfile = await this.firebase.getUserProfiles(uid).toPromise();
      if (userProfile && userProfile.perfil === 3) {
        return true; // Allow access to the component for users with perfil 3
      } else {
        this.router.navigate(['/index']);
        return false; // Redirect other users to the index
      }
    } else {
      this.router.navigate(['/index']);
      return false; // Redirect unauthenticated users to the index
    }
  }
  
  
  filtrarPublicaciones() {
    const filtro = this.rutUsuario.toLowerCase(); // Convertir a minúsculas para búsqueda
  
    this.publicaciones.subscribe(data => {
      this.publicacionesFiltradas = data.filter((publicacion: any) => {
        const rutPublicacion = publicacion.rut.replace(/\./g, '').toLowerCase(); // Eliminar puntos y convertir a minúsculas
        const dvPublicacion = publicacion.dv.toLowerCase(); // Convertir dígito verificador a minúsculas
        const rutCompleto = rutPublicacion + '-' + dvPublicacion; // Rut completo (sin puntos y con guión)
        const idPublicacion = publicacion.id.toLowerCase(); // Convertir ID a minúsculas
        
        return (
          rutCompleto.includes(filtro) || // Verificar si el filtro está presente en el rut completo de la publicación
          idPublicacion.includes(filtro) // Verificar si el filtro está presente en el ID de la publicación
        );
      });
      
      this.noHayPublicaciones = this.publicacionesFiltradas.length === 0; // Verificar si no hay publicaciones
    });
  }
  
  

  // Redirigir a la página de edición de una publicación
  editarPublicacion(id?: string) {
    if (id) {
      this.router.navigate(['/gest-editar-publicacion', id]);
    }
  }
  
  // Mostrar el diálogo de confirmación de eliminación de publicación
  mostrarDialogo(publicacion: any) {
    this.publicacionSeleccionada = publicacion; // Almacenar la publicación seleccionada
    this.mostrarPrompt = true;
  }
  
  // Eliminar una publicación
  eliminarPublicacion() {
    const publicacionId = this.publicacionSeleccionada.id;
  
    this.publicacionService.deletePublicacion(publicacionId)
      .then(() => {
        console.log('Publicación eliminada correctamente');
        this.toast.success('Publicación eliminada correctamente');
        this.cerrarDialogo(); // Cerrar el diálogo después de eliminar la publicación
      })
      .catch((error: any) => {
        console.error('Error al eliminar la publicación:', error);
        // Manejar el error de eliminación
        this.cerrarDialogo(); // Cerrar el diálogo en caso de error
      });
  }
  
  // Cerrar el diálogo de eliminación de publicación
  cerrarDialogo() {
    this.mostrarPrompt = false;
  }
}
