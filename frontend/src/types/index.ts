export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  availability: boolean;
  publisher: string;
  languageCode: string;
  publicationDate: string;
  price: number;
  rentingCost: number;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  outstandingDept: number;
}

export interface BorrowRecord {
  id: number;
  book: Book;
  member: Member;
  issueDate: string;
  returnDate: string | null;
  fine: number;
  returned: boolean;
}

export interface User {
  id: number;
  email: string;
  password?: string;
  role: 'librarian';
} 