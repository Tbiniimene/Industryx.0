import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AcceuilComponent} from './acceuil/acceuil.component'
import { BlogComponent } from './blog/blog.component';
import {AppComponent} from './app.component';
import {FourZeroFourComponent} from './four-zero-four/four-zero-four.component'
import {RegisterComponent} from './register/register.component'

//ALL ROUTES
const routes: Routes = [
  //HOME ROUTE
  { path: '', component: AcceuilComponent },
  //REGISTER ROUTE
  { path: 'register', component: RegisterComponent },
  //BLOG ROUTE
  { path: 'blog', component: BlogComponent },
  //ERROR 404 PAGE
  { path: '**', component: FourZeroFourComponent }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [BlogComponent]
