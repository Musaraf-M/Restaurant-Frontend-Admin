export interface Restaurant {
    _id: string;
    name: string;
    address: string;
    city: string;
    description: string;
    dishes: Array<String>;
    createdAt: string;
}

export interface RestaurantData {
    name: string;
    description: string;
    address: string;
    city: string;
    cuisine: string;
    restaurantType: string;
}