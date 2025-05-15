import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Example User service to get role info
import { AuthService } from '../auth.service';

interface Product {
  ProductID: number;
  Name: string;
  Description: string;
  Price: number;
  CategoryID: number;
  ThumbnailURL: string;
  // add other properties if needed
}

interface Category {
  CategoryID: number;
  Name: string;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  searchTerm: string = '';
  selectedCategoryId: string = '';
  isAdmin: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.checkUserRole();
    this.loadCategories();
    this.loadAllProducts(); // optional: load all products initially
  }

  checkUserRole() {
    // Assuming authService provides user info
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.RoleName === 'Admin';
  }

  loadCategories() {
    // Replace with your actual API
    this.http.get<Category[]>('/api/categories').subscribe(cats => {
      this.categories = cats;
    });
  }

  loadAllProducts() {
    // Optional: load all products at start
    this.http.get<Product[]>('/api/products').subscribe(prods => {
      this.products = prods;
    });
  }

  searchProducts() {
    if (!this.searchTerm.trim()) {
      // Optionally, load all products or clear list
      this.loadAllProducts();
      return;
    }
    this.http.get<Product[]>(`/api/products/search?term=${encodeURIComponent(this.searchTerm)}`)
      .subscribe(prods => {
        this.products = prods;
      }, error => {
        this.products = [];
        console.error('Search error', error);
      });
  }

  filterByCategory() {
    if (!this.selectedCategoryId) {
      this.loadAllProducts();
      return;
    }
    const categoryId = this.selectedCategoryId;
    this.http.get<Product[]>(`/api/products/category/${categoryId}`)
      .subscribe(prods => {
        this.products = prods;
      }, error => {
        this.products = [];
        console.error('Category filter error', error);
      });
  }

  updateProduct(product: Product) {
    // Implement update logic (e.g., open modal with form)
    alert(`Update product: ${product.Name}`);
  }

  deleteProduct(product: Product) {
    // Confirm delete
    if (confirm(`Are you sure you want to delete ${product.Name}?`)) {
      this.http.delete(`/api/products/${product.ProductID}`)
        .subscribe(() => {
          // Refresh product list after delete
          this.products = this.products.filter(p => p.ProductID !== product.ProductID);
        }, error => {
          console.error('Delete error', error);
        });
    }
  }

  viewProduct(product: Product) {
    // Implement viewing the 3D model or product details
    alert(`Viewing model for: ${product.Name}`);
  }
}
