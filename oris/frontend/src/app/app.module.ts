import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';

import { DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomTooltipDirective } from '../directives/custom-tooltip.directive';
import { FontResizerDirective } from '../directives/font-resizer.directive';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppProdStagingTableComponent } from './components/app-prod-staging-table/app-prod-staging-table.component';
import { TableHeaderComponent } from './components/app-prod-staging-table/table-header/table-header.component';
import { NavLayoutComponent } from './components/eds/nav-layout/nav-layout.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/later-dev-helpful/header/header.component';
import { ContentHeaderComponent } from './components/utils/content-header/content-header.component';
import { CustomTooltipComponent } from './components/utils/custom-tooltip/custom-tooltip.component';
import { SwitchThemeComponent } from './components/utils/switch-theme/switch-theme.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FontResizerDirective,
    CustomTooltipComponent,
    CustomTooltipDirective,
    FooterComponent,
    FeedbackComponent,
    ContentHeaderComponent,
    AppProdStagingTableComponent,
    SwitchThemeComponent,
    TableHeaderComponent,
    NavLayoutComponent,
    HomeComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatGridListModule,
    MatTableModule,
    MatDividerModule,
    MatFormFieldModule, 
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatListModule,
    AppRoutingModule,
    MatExpansionModule,
    MatStepperModule,
    FormsModule,
    MatSliderModule
  ],
  providers: [
    DecimalPipe,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
