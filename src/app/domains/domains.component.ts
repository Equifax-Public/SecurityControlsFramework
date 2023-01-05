import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.scss']
})
export class DomainsComponent implements OnInit {
  searchText: string = "";
  cols: number;
  domainsList: any;
  displayDomains = [];
  gridByBreakpoint = {
    xl: 4,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 1
  }

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private http: HttpClient) {
    this.cols = 3;
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = this.gridByBreakpoint.xs;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = this.gridByBreakpoint.sm;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = this.gridByBreakpoint.lg;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = this.gridByBreakpoint.xl;
        }
      }
    });
   }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.getJSON().subscribe(data => {
      this.domainsList = data;
      this.applyFilter()
    });
  }

  applyFilter() {
    this.displayDomains = [];
    for (let i = 0; i < this.domainsList.length; i++) {
      if (this.domainsList[i].name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1) {
        this.displayDomains.push(this.domainsList[i])
      }
    }
  }

  getJSON(): Observable<any> {
    return this.http.get("./assets/domains_descriptions_control.json");
  }

  goToDomain(domain: string) {
    this.router.navigateByUrl('/domains/' + domain);
  }
}
