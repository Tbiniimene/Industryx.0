import { Component } from '@angular/core';
import { Router} from '@angular/router';


import * as $ from "jquery";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
 
})
export class AppComponent {
  title = 'Industry x.0';
  

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }
  



 
}

