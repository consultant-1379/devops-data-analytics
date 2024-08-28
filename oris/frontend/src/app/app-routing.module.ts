import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppProdStagingTableComponent } from './components/app-prod-staging-table/app-prod-staging-table.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent,title: 'DevOps Data Analytics'},
  { path: 'eic/application-product-dora', component: AppProdStagingTableComponent, title: 'DODA - Dora Metrics'},
  { path: 'footer', component: FooterComponent, title: 'DODA - Footer'},
  { path: 'feedback',component: FeedbackComponent, title: 'DODA - Feedback'},
  { path: '', redirectTo: '/home', pathMatch: 'full', title: 'DevOps Data Analytics Dashboard'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
