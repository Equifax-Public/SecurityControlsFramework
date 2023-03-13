import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToRoles() {
    this.router.navigateByUrl('/roles');
  }

  goToAllTr() {
    this.router.navigateByUrl('/roles/Full Framework');
  }

  goToDomains() {
    this.router.navigateByUrl('/domains');
  }

  goToCompliance() {
    this.router.navigateByUrl('/compliance');
  }

  downloadFramework() {
    window.open("assets/CISO%20-%20TR.csv");
    window.open("assets/CISO%20-%20CONTROL.csv");
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  } 
}
