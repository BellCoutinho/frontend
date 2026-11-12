import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PRODUCT_CATEGORIES, WARRANTY_TYPES } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-register',
  standalone: false,
  templateUrl: './product-register.component.html',
  styleUrls: ['./product-register.component.scss'],
})
export class ProductRegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  categories = PRODUCT_CATEGORIES;
  warrantyTypes = WARRANTY_TYPES;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  get categoryOptions() {
    return this.categories.map((c) => ({ value: c, label: c }));
  }

  get warrantyTypeOptions() {
    return [
      { value: '', label: 'Sem garantia / Não informada' },
      ...this.warrantyTypes.map((w) => ({ value: w, label: w })),
    ];
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      location: ['', [Validators.required]],
      purchase_value: [null, [Validators.required, Validators.min(0)]],
      purchase_date: [''],
      serial_number: [''],
      warranty_type: [''],
      warranty_expiry: [''],
      extended_warranty_expiry: [''],
    });
  }

  f(name: string) {
    return this.form.get(name)!;
  }

  getError(name: string): string {
    const ctrl = this.f(name);
    if (!ctrl || !ctrl.touched || ctrl.valid) return '';
    if (ctrl.errors?.['required']) return 'Campo obrigatório.';
    if (ctrl.errors?.['minlength']) {
      return `Mínimo de ${ctrl.errors['minlength'].requiredLength} caracteres.`;
    }
    if (ctrl.errors?.['min']) return 'Valor não pode ser negativo.';
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const spaceId = this.authService.getSpaceId();
    if (!spaceId) {
      this.errorMessage = 'Usuário não identificado. Faça login novamente.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const val = this.form.value;
    const payload = {
      space_id: spaceId,
      name: val.name,
      category: val.category,
      brand: val.brand,
      model: val.model,
      location: val.location,
      purchase_value: Number(val.purchase_value),
      purchase_date: val.purchase_date || null,
      serial_number: val.serial_number || null,
      warranty_type: val.warranty_type || null,
      warranty_expiry: val.warranty_expiry || null,
      extended_warranty_expiry: val.extended_warranty_expiry || null,
    };

    this.productService.registerProduct(payload).subscribe({
      next: (product) => {
        this.loading = false;
        this.successMessage = 'Item cadastrado com sucesso! Redirecionando...';
        setTimeout(() => this.router.navigate(['/products', product.id]), 1200);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.detail ?? 'Erro ao cadastrar item. Verifique os dados.';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
