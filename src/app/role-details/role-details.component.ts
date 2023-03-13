import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit {
  roleTitle: string | null = "";
  roleData;
  displayedControlColumns: string[] = ['Domain_Name', 'Domain', 'Control_ID', 'Control_Desc', 'Control_Scope', 'Control_Owner', 'Control_Operator', 'Control_Type', 'Control_Type2'];
  displayedTRColumns: string[] = ['Domain_Name', 'Domain', 'TR_ID', 'TR_Description', 'Sub_TR_Order', 'Sub_TR_Indent', 'Sub_TR_ID', 'TR_Scope'];
  displayedMappingColumns: string[] = ['Control_ID', 'Control_Statement', 'TR_ID', 'Technical_Requirement'];
  dataSourceControl;
  dataSourceTR;
  dataSourceMapping;
  selectedOption = "CONTROL";
  roleOptions = ["CONTROL", "TR", "Mapping"];
  selected = new FormControl(0);

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.roleTitle = this.route.snapshot.paramMap.get('role');
    this.loadDataControl(this.roleTitle);
    this.loadDataTR(this.roleTitle);
  }

  back() {
    this.router.navigateByUrl('/roles');
  }

  loadDataControl(roleTitle: any) {
    if (roleTitle == "Full Framework") {
      roleTitle = "CISO";
    };

    this.getJSON(roleTitle + " - CONTROL").subscribe(data => {
      var json = this.csvJSON(data, null, '"', ',')
      this.dataSourceControl = json;
      this.loadDataMapping(json);
    });
  }

  loadDataTR(roleTitle: any) {
    if (roleTitle == "Full Framework") {
      roleTitle = "CISO";
    };

    this.getJSON(roleTitle + " - TR").subscribe(data => {
      var json = this.csvJSON(data, null, '"', ',')
      this.dataSourceTR = json;
    });
  }

  loadDataMapping(controlData) {
    this.getJSON("TR_Controls_Mapping").subscribe(data => {
      var json = this.csvJSON(data, null, '"', ',')
      this.dataSourceMapping = json;
    });
  }

  getJSON(value: string): Observable<any> {
    return this.http.get("./assets/" + value + ".csv", {responseType: 'text'});
  }

  csvJSON(csv: any, headers, quoteChar='"', delimiter =',') {
    const regex = new RegExp(`\\s*(${quoteChar})?(.*?)\\1\\s*(?:${delimiter}|$)`, 'gs');
    const match = line => [...line.matchAll(regex)]
      .map(m => m[2])
      .slice(0, -1);

    const lines = csv.split('\n');
    const heads = headers ?? match(lines.shift());

    return lines.map(line => {
      return match(line).reduce((acc, cur, i) => {
        const val = cur.length <= 0 ? null : Number(cur) || cur;
        const key = heads[i] ?? `extra_${i}`;
        return { ...acc, [key]: val };
      }, {});
    });
  }

  downloadCSV() {
    let title = this.roleTitle;
    if (title == "Full Framework") {
      title = "CISO";
    }
    if (this.selected.value == 0) {
      window.open("assets/" + title + "%20-%20CONTROL.csv");
    } else if (this.selected.value == 1) {
      window.open("assets/" + title + "%20-%20TR.csv");
    } else if (this.selected.value == 2) {
      window.open("assets/TR_Controls_Mapping.csv");
    }
  }
}
