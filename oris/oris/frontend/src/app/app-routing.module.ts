import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppProdStagingTableComponent } from './components/app-prod-staging-table/app-prod-staging-table.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'table', component: AppProdStagingTableComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'feedback',component: FeedbackComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
