import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.scss']
})
export class ComplianceComponent implements OnInit {
  displayedCISColumns:  string[] = ['opensource_control_id', 'opensource_control_domain', 'control_domain', 'Control_ID', 'Updated_EFX_Control_Description', 'CIS_Control_Number', 'CIS_Control_Title', 'CIS_Control_Description'];
  displayedNISTColumns: string[] = ['opensource_control_id', 'opensource_control_domain', 'control_domain', 'Control_ID', 'Control_Statement','CSF_Subcategory_ID','CSF_Subcategory_Description'];
  dataSourceCIS;
  dataSourceNIST;
  selected = new FormControl(0);
 
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDataCIS();
    this.loadDataNIST();
  }

  downloadCSV() {
    if (this.selected.value == 0) {
      window.open("/assets/CS_to_CIS_Mapping.csv");
    } else if (this.selected.value == 1) {
      window.open("/assets/CS_to_NIST_CSF_Mapping.csv");
    }
  }

  loadDataCIS() {
    this.getJSON("CS_to_CIS_Mapping").subscribe(data => {
      var json = this.csvJSON(data, null, '"', ',')
      this.dataSourceCIS = json;
    });
  }

  loadDataNIST() {
    this.getJSON("CS_to_NIST_CSF_Mapping").subscribe(data => {
      var json = this.csvJSON(data, null, '"', ',')
      console.log(json)
      this.dataSourceNIST = json;
      
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
        // Attempt to parse as a number; replace blank matches with `null`
        const val = cur.length <= 0 ? null : Number(cur) || cur;
        const key = heads[i] ?? `extra_${i}`;
        return { ...acc, [key]: val };
      }, {});
    });
  }
}
