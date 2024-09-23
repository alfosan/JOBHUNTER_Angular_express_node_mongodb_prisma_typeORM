import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOffertsComponent } from '../shared/list-offerts/list-offerts.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ListOffertsComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'] 
})
export class ShopComponent {}
