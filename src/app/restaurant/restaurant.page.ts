import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Restaurant, RestaurantData } from '../models/restaurant.model';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Dish } from '../models/dish.model';
import { ExtractDish } from '../models/dish.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {
  @ViewChild('searchbar', { static: true }) searchBar: ElementRef;
  restaurant: RestaurantData = {
    address: '',
    city: '',
    description: '',
    name: '',
    cuisine: '',
    restaurantType: ''
  };

  dish: Dish = {
    cuisine: '',
    cost: '',
    description: '',
    name: '',
    type: '',
    restaurantId: '',
  };

  dishes: Dish[];
  filters: Dish[] = [];
  lists: Dish[] = [];
  restaurantId = null;
  searchTerm: string = '';
  clickedData: string;

  // Restaurant Id
  oldRestaurant: Restaurant;

  extractedDishes: ExtractDish[] = [];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    // Get Route Params
    this.route.queryParams.subscribe((params) => {
      this.restaurantId = params.id;
      if (this.restaurantId) {
        this.getRestaurantData(params.id);
      }
    });
  }

  ngOnInit(): void {
    this.api.getDish().subscribe((data) => {
      this.dishes = data;
      if (this.restaurantId) {
        this.getRestaurantDishes();
      }
    });
  }

  // Get restaurant data
  getRestaurantData(resId: string): void {
    const restaurantData = JSON.parse(localStorage.getItem(resId));
    if (!restaurantData) {
      this.api.getRestaurant({ _id: resId }).subscribe((data) => {
        this.oldRestaurant = data[0] as Restaurant;
      });
    } else {
      this.oldRestaurant = restaurantData as Restaurant;
    }

    this.restaurant.name = this.oldRestaurant.name;
    this.restaurant.description = this.oldRestaurant.description;
    this.restaurant.city = this.oldRestaurant.city;
    this.restaurant.address = this.oldRestaurant.address;
  }

  // Get restaurant dishes
  getRestaurantDishes(): void {
    this.extractedDishes = [];
    this.dishes.forEach((element) => {
      element.restaurant.forEach((res) => {
        if (res.id === this.restaurantId) {
          this.extractedDishes.push(
            this.extractDish(this.restaurantId, element)
          );
        }
      });
    });
  }

  // Add restaurant
  addRestaurant(): void {
    this.api.setRestaurant(this.restaurant).subscribe((data) => {
      if (data) {
        this.restaurantId = data.restaurantId;
      }
      console.log(data);
    });
  }

  //Search implementation
  setFilteredItems(): void {
    if (this.clickedData != this.searchTerm) {
      this.filters = this.dishes.filter((item) => {
        return (
          item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
        );
      });
      this.clickedData = null;
    }
  }

  // Search filter data formation
  filterSelect(data): void {
    console.log(data);
    this.searchTerm = data.name;
    this.clickedData = data.name;
    this.dish.description = data.description;
    this.filters = [];
  }

  //  Add new dish
  addDish(): void {
    this.dish.name = this.searchTerm;
    this.dish.restaurantId = this.restaurantId;
    this.api.setDish(this.dish).subscribe((data) => {
      if (data) {
        let extractedDish;
        if (data.dish) {
          extractedDish = this.extractDish(this.restaurantId, data.dish);
        } else {
          extractedDish = this.extractDish(this.restaurantId, data[0]);
        }

        this.extractedDishes.push(extractedDish);

        this.dish = {
          cuisine: '',
          cost: '',
          description: '',
          name: '',
          type: '',
          restaurantId: '',
        };
        this.searchTerm = '';
      }
      //console.log(data);
    });
  }

  // Dish extration and formation
  extractDish(restaurantId: string, dish: Dish): ExtractDish {
    let tempObj: ExtractDish = {
      name: '',
      cost: '',
      description: '',
    };
    tempObj.name = dish.name;
    tempObj.description = dish.description;

    dish.restaurant.forEach((element) => {
      if (element.id === restaurantId) {
        tempObj.cost = element.cost;
      }
    });

    return tempObj;
  }
}
