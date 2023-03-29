import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DownloadFileModalComponent } from '../shared/download-file-modal/download-file-modal.component';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.scss']
})
export class ComplianceComponent implements OnInit {
  displayedCISColumns:  string[] = ['control_id', 'control_domain', 'Control_Description', 'CIS_Control_Number', 'CIS_Control_Title', 'CIS_Control_Description'];
  displayedNISTColumns: string[] = ['control_id', 'control_domain', 'Control_Statement','CSF_Subcategory_ID','CSF_Subcategory_Description'];
  dataSourceCIS;
  dataSourceNIST;
  selected = new FormControl(0);
  view = "CS_to_CIS_Mapping";
 
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadDataCIS();
    this.loadDataNIST();
  }

  updateTab(index) {
    if (index == 0) {
      this.view = "CS_to_CIS_Mapping";
    } else if (index == 1) {
      this.view = "CS_to_NIST_CSF_Mapping";
    }
  }

  downloadCSV() {
    if (this.selected.value == 0) {
      window.open("assets/CS_to_CIS_Mapping.csv");
    } else if (this.selected.value == 1) {
      window.open("assets/CS_to_NIST_CSF_Mapping.csv");
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
      this.dataSourceNIST = json;
    });
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(DownloadFileModalComponent, {
      data: {name: "compliance", view: this.view, origin: "Compliance", file: null}
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
}
