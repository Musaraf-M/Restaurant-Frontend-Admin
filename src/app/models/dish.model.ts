export interface Dish {
  name: string;
  description: string;
  cuisine: string;
  type: string;
  restaurantId: string;
  cost: string;
  restaurant?: Array<any>;
}

export interface ExtractDish {
  name: string;
  description: string;
  cost: string;
}
