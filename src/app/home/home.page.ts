import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Restaurant } from '../models/restaurant.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  restaurants: Restaurant[];
  constructor(
    private alertController: AlertController,
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.api.getRestaurant().subscribe((data) => {
      this.restaurants = data;
    });
  }

  // Add restaurant navigation
  presentAlertPrompt(): void {
    this.router.navigate(['restaurant']);
  }

  // Navigate to restaurant page
  restaurantClicked(restaurant: Restaurant): void {
    localStorage.setItem(restaurant._id, JSON.stringify(restaurant));
    this.router.navigate(['restaurant'], {
      queryParams: { id: restaurant._id },
    });
  }

  // Log user out
  logout(): void {
    this.auth.removeToken();
    this.router.navigate(['login']);
  }

  // referesh the page
  doRefresh(event): void {
      this.ngOnInit();
      event.target.complete();
  }
}
