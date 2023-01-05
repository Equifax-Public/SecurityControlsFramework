import { Component, Inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesService } from '../services/roles.service';

export interface DialogData {
  name: '';
}

// COMPONENT TO ADD A NEW ROLE
@Component({
  selector: 'add-dialog',
  templateUrl: 'add-dialog.html',
  styleUrls: ['./manage.component.scss']
})
export class AddDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>, private http: HttpClient, private rolesService: RolesService) {}
  name;
  description;
  rolesList;

  submit() {
    this.rolesService.addRoleDescription(this.name, this.description);
    let updatedRoles = this.rolesService.getRoleDescriptions();
    this.downloadUpdatedFile(JSON.stringify(updatedRoles));
  }

  downloadUpdatedFile(updatedRoles) {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = 'roles_descriptions.json'; // the file name
    const myFileContent: JSON = updatedRoles;
    dlink.href = 'data:text/plain;charset=utf-16,' + myFileContent;
    dlink.click(); // this will trigger the dialog window
    dlink.remove();
  }

  downloadTemplates() {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = 'template'; // the file name
    const myFileContent: string = 'I am a text file! 😂';
    dlink.href = 'data:text/plain;charset=utf-16,' + myFileContent;
    dlink.click(); // this will trigger the dialog window
    dlink.remove();
  }
}

// COMPONENT TO DELETE A ROLE
@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html',
  styleUrls: ['./manage.component.scss']
})
export class DeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>, private http: HttpClient, private rolesService: RolesService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  name;
  description;
  rolesList;

  deleteRole() {
    this.rolesService.deleteRoleDescription(this.data.name);
    let updatedRoles = this.rolesService.getRoleDescriptions();
    this.downloadUpdatedFile(JSON.stringify(updatedRoles));
  }

  downloadUpdatedFile(updatedRoles) {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = 'roles_descriptions.json';
    const myFileContent: JSON = updatedRoles;
    dlink.href = 'data:text/plain;charset=utf-16,' + myFileContent;
    dlink.click();
    dlink.remove();
  }

  downloadTemplates() {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = 'template';
    const myFileContent: string = 'I am a text file! 😂';
    dlink.href = 'data:text/plain;charset=utf-16,' + myFileContent;
    dlink.click();
    dlink.remove();
  }
}

// Main Component
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

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

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private http: HttpClient, public dialog: MatDialog, private rolesService: RolesService) {
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
    this.rolesService.getRoleDescriptions().subscribe(data => {
      this.rolesList = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    this.displayRoles = [];
    for (let i = 0; i < this.rolesList.length; i++) {
      if (this.rolesList[i].name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1) {
        this.displayRoles.push(this.rolesList[i])
      }
    }
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      width: '750px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("refreshing data")
      this.loadData();
    })
  }

  deleteDialog(enterAnimationDuration: string, exitAnimationDuration: string, name) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {name: name},
      width: '750px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("refreshing data")
      this.loadData();
    })
  }
}
