import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../layout/layout.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductRegisterComponent } from './components/product-register/product-register.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductRegisterComponent,
    ProductDetailComponent,
  ],
  imports: [
    SharedModule,
    LayoutModule,
    ProductRoutingModule,
  ],
})
export class ProductModule {}
