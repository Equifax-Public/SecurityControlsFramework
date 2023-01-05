import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  searchText: string = "";
  cols: number;
  rolesList: any;
  displayRoles = [];
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
      this.rolesList = data;
      this.applyFilter()
    });
  }

  getJSON(): Observable<any> {
    return this.http.get("./assets/roles_descriptions.json");
  }

  applyFilter() {
    this.displayRoles = [];
    for (let i = 0; i < this.rolesList.length; i++) {
      if (this.rolesList[i].name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1) {
        this.displayRoles.push(this.rolesList[i])
      }
    }
  }

  goToRole(role: string) {
    this.router.navigateByUrl('/roles/' + role);
  }
}
