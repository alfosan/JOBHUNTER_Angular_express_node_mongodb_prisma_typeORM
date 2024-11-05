import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { OfferService } from '../core/service_prisma/offerts.service';
import { Router } from '@angular/router';
import { UserEnterpriseService } from '../core/service_prisma/userEnterprise.service';
import { Offert } from '../core/models_prisma/offertEnterprise.model';

@Component({
  selector: 'app-enterprise-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enterprise-dashboard.component.html',
  styleUrls: ['./enterprise-dashboard.component.css'],
  providers: [OfferService]
})
export class EnterpriseDashboardComponent implements OnInit {
  offers: Offert[] = [];
  isAuthenticated: boolean = false;

  constructor(
    private offerService: OfferService,
    private router: Router,
    private userEnterpriseService: UserEnterpriseService
  ) {}

  ngOnInit() {
    this.userEnterpriseService.isAuthenticated.subscribe((isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
      if (this.isAuthenticated) {
        this.loadOffers();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  loadOffers() {
    this.offerService.getOffers().subscribe(
      (data: Offert[]) => { 
        this.offers = data.map(offer => ({
          ...offer,
          isActive: offer.isActive ?? true 
        }));
      },
      error => {
        console.error('Error al cargar las ofertas', error);
      }
    );
  }

  redirectToCreateOffer() {
    this.router.navigate(['/enterprise-create-offerts']);
  }

  createOffer(offerData: any) {
    const user = this.userEnterpriseService.getCurrentUser();
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    offerData.userId = user.email; // Asegúrate de asignar correctamente el ID de usuario.

    this.offerService.createOffer(offerData).subscribe(
      (response) => {
        console.log('Oferta creada:', response);
        this.loadOffers();
      },
      (error) => {
        console.error('Error al crear la oferta', error);
      }
    );
  }

  toggleOfferStatus(offer: Offert) {
    const updatedStatus = !offer.isActive;
    this.offerService.updateOfferStatus(offer.id, updatedStatus).subscribe(
      response => {
        offer.isActive = updatedStatus;
      },
      error => {
        console.error('Error updating offer status:', error);
      }
    );
  }

  editOffer(offer: Offert) {
    this.router.navigate(['/enterprise-edit-offerts', offer.id]);
  }

  deleteOffer(offerId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta oferta?')) {
      this.offerService.deleteOffer(offerId).subscribe(
        response => {
          console.log('Oferta eliminada:', response);
          this.offers = this.offers.filter(offer => offer.id !== offerId);
        },
        error => {
          console.error('Error eliminando la oferta:', error);
        }
      );
    }
  }

  toggleProfileEnterprise() {
    this.router.navigate(['/enterprise-profile']); // Redirigir a la ruta del perfil
  }
}
