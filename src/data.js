// Dummy book data for the platform
export const BOOKS = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    condition: "Like New",
    price: 250,
    rating: 4.8,
    reviews: 124,
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones. This book is in excellent condition, barely used. A life-changing read on the science of habits.",
    seller: { name: "Priya Sharma", avatar: "PS", city: "Mumbai", rating: 4.9, sales: 23 },
    images: ["https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg"],
    postedAt: "2 days ago"
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    condition: "Good",
    price: 120,
    rating: 4.7,
    reviews: 89,
    description: "A magical story about following your dreams. Minor wear on the cover, pages are clean and in great condition. A timeless masterpiece.",
    seller: { name: "Rahul Verma", avatar: "RV", city: "Delhi", rating: 4.6, sales: 15 },
    images: ["https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg"],
    postedAt: "5 days ago"
  },
  {
    id: 3,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    genre: "Finance",
    condition: "New",
    price: 320,
    rating: 4.6,
    reviews: 210,
    description: "What the rich teach their kids about money. Brand new, unopened. Perfect gift for anyone interested in financial independence.",
    seller: { name: "Aarav Singh", avatar: "AS", city: "Bangalore", rating: 5.0, sales: 41 },
    images: ["https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388211242i/69571.jpg"],
    postedAt: "1 day ago"
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic",
    condition: "Good",
    price: 180,
    rating: 4.9,
    reviews: 305,
    description: "A classic of American literature, dealing with serious issues of racial inequality and moral growth. Some highlighting inside, but the spine is intact.",
    seller: { name: "Sneha Patel", avatar: "SP", city: "Pune", rating: 4.7, sales: 8 },
    images: ["https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg"],
    postedAt: "3 days ago"
  },
  {
    id: 5,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Finance",
    condition: "Like New",
    price: 290,
    rating: 4.8,
    reviews: 167,
    description: "Timeless lessons on wealth, greed, and happiness. Read once, kept in plastic sleeve. No marks or highlights inside.",
    seller: { name: "Karan Mehta", avatar: "KM", city: "Hyderabad", rating: 4.8, sales: 31 },
    images: ["https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg"],
    postedAt: "6 hours ago"
  },
  {
    id: 6,
    title: "Harry Potter & The Sorcerer's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    condition: "Acceptable",
    price: 90,
    rating: 4.9,
    reviews: 540,
    description: "The beloved first book of the Harry Potter series. Cover is worn, but all pages are intact. A wonderful read for the whole family.",
    seller: { name: "Ananya Roy", avatar: "AR", city: "Kolkata", rating: 4.5, sales: 12 },
    images: ["https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg"],
    postedAt: "1 week ago"
  },
  {
    id: 7,
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Self-Help",
    condition: "New",
    price: 350,
    rating: 4.7,
    reviews: 98,
    description: "Rules for Focused Success in a Distracted World. Bought but never read — decided to switch to audiobook. Absolutely mint condition.",
    seller: { name: "Vikram Nair", avatar: "VN", city: "Chennai", rating: 4.9, sales: 19 },
    images: ["https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1447957962i/25744928.jpg"],
    postedAt: "4 days ago"
  },
  {
    id: 8,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "History",
    condition: "Good",
    price: 230,
    rating: 4.8,
    reviews: 422,
    description: "A Brief History of Humankind. Mind-expanding book that traces the history of our species. Minor pen marks on 2 pages, otherwise in great condition.",
    seller: { name: "Meera Iyer", avatar: "MI", city: "Ahmedabad", rating: 4.6, sales: 7 },
    images: ["https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1420585954i/23692271.jpg"],
    postedAt: "2 weeks ago"
  }
];

export const CATEGORIES = ["All", "Fiction", "Self-Help", "Finance", "Classic", "Fantasy", "History", "Science", "Romance", "Thriller"];

export const CONDITIONS = ["New", "Like New", "Good", "Acceptable"];

export const GENRES = ["Fiction", "Non-Fiction", "Self-Help", "Finance", "Science", "History", "Romance", "Thriller", "Fantasy", "Classic", "Biography", "Children", "Academic", "Other"];

export const getConditionClass = (cond) => {
  switch(cond) {
    case 'New': return 'cond-new';
    case 'Like New': return 'cond-like-new';
    case 'Good': return 'cond-good';
    case 'Acceptable': return 'cond-acceptable';
    default: return 'cond-good';
  }
};
