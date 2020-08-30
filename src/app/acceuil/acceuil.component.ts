import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { HostListener } from '@angular/core';


@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.css']
})
export class AcceuilComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  gotopage(pagename: string): void {
    this.router.navigate([`${pagename}`])

  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    let element = document.querySelector('.navbar');
    if (window.pageYOffset > element.clientHeight) {
      element.classList.add('navbar-scroll');
    } else {
      element.classList.remove('navbar-scroll');
    }
  }


}
