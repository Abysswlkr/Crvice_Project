import { Component, OnInit } from '@angular/core';
import { PublicacionesService } from 'src/app/services/publicaciones.service'; 
import { Publicacion } from 'src/app/models/publicacion'; 
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {
  publicaciones!: Publicacion[];
  termino!: string;
  public isLoading: boolean= false;

  constructor(private publicacionesService: PublicacionesService, 
              private router: Router, 
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      this.termino = params['termino'];
    });
    this.publicacionesService.getPublicaciones().subscribe(publicaciones => {
      this.publicaciones = publicaciones;
      this.isLoading = false;
    });
  }

  abrirPublicacion(id?: string) {
    if (id) {
      this.router.navigate(['/publicacion', id]);
    }
  }
}