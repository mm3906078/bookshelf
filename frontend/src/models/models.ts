export interface Book {
  book_id: string;
  title: string;
  year: number;
  author: string;
  genre: string;
  price: number;
}

export interface Order {
  book_id: string;
  order_date: any;
  order_id: string;
  user_id: string;
}
