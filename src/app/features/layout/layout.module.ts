import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

@NgModule({
  declarations: [SidebarComponent, MainLayoutComponent],
  imports: [SharedModule],
  exports: [MainLayoutComponent],
})
export class LayoutModule {}
