import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-domain-details',
  templateUrl: './domain-details.component.html',
  styleUrls: ['./domain-details.component.scss']
})
export class DomainDetailsComponent implements OnInit {
  domainTitle: string | null = "";
  domainData;
  displayedControlColumns: string[] = ['Domain_Name', 'Domain', 'Control_ID', 'Control_Desc', 'Control_Scope', 'Control_Owner', 'Control_Operator', 'Control_Type', 'Control_Type2'];
  displayedTRColumns: string[] = ['Domain_Name', 'Domain', 'TR_ID', 'TR_Description', 'Sub_TR_Order', 'Sub_TR_Indent', 'Sub_TR_ID', 'TR_Scope']
  displayedMappingColumns: string[] = ['Control_ID', 'Control_Statement', 'TR_ID', 'Technical_Requirement'];
  dataSourceControl;
  dataSourceTR;
  dataSourceMapping;
  selected = new FormControl(0);

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.domainTitle = this.route.snapshot.paramMap.get('domain');
    this.loadDataControl(this.domainTitle);
    this.loadDataTR(this.domainTitle);
    this.loadDataMapping();
  }

  back() {
    this.router.navigateByUrl('/domains');
  }

  loadDataControl(domainTitle: any) {
    this.getJSON("CISO - CONTROL").subscribe(data => {
      var json = this.csvJSON(data, null, '"', ',');
      this.dataSourceControl = this.filterDomain(domainTitle, json);
    });
  }

  loadDataTR(domainTitle: any) {
    this.getJSON("CISO - TR").subscribe(data => {
      var json = this.csvJSON(data, null, '"', ',');
      this.dataSourceTR = this.filterDomain(domainTitle, json);
    });
  }

  loadDataMapping() {
    this.getJSON("TR_Controls_Mapping").subscribe(data => {
      var json = this.csvJSON(data, null, '"', ',')
      this.dataSourceMapping = json;
    });
  }

  filterDomain(domainTitle, data) {
    let filteredData = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i]['Domain Name'] == domainTitle) {
        filteredData.push(data[i])
      }
    }
    return filteredData;
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
    if (this.selected.value == 0) {
      this.downloadCSVCONTROL();
    } else if (this.selected.value == 1) {
      this.downloadCSVTR();
    } else if (this.selected.value == 2) {
      window.open("assets/TR_Controls_Mapping.csv");
    }
  }

  downloadCSVCONTROL() {
    let data = this.dataSourceControl;
    let arrHeader = ["Domain Name", "Domain", "Control_ID", "Control_Desc", "Control_Scope", "Control_Owner", "Control_Operator", "Control_Type", "Control_Type"];
    let csvData = this.ConvertToCSV(data, arrHeader, 'CONTROL');
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", this.domainTitle + " - CONTROL.csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  downloadCSVTR() {
    let data = this.dataSourceTR;
    let arrHeader = ["Domain Name", "Domain", "TR_ID", "Sub_TR_Order", "Sub_TR_Indent", "Sub_TR_ID", "TR_Description", "TR_Scope"];
    let csvData = this.ConvertToCSV(data, arrHeader, 'TR');
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", this.domainTitle + " - TR.csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList, type) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    let newHeaders;

    if (type == 'TR') {
      newHeaders = ["Domain Name", "Domain", "TR_ID", "Sub_TR_Order", "Sub_TR_Indent", "Sub_TR_ID", "TR_Description", "TR_Scope"];
    } else if(type == 'CONTROL') {
      newHeaders = ["Domain Name", "Domain", "Control_ID", "Control_Desc", "Control_Scope", "Control_Owner", "Control_Operator", "Control_Type", "Control_Type"];
    }
    
    for (let index in newHeaders) {
      row += newHeaders[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];

        line += ',' + this.strRep(array[i][head]);
      }
      str += line + '\r\n';
    }
    return str;
  }

  strRep(data) {
    if(typeof data == "string") {
      let newData = data.replace(/,/g, " ");
       return newData;
    }
    else if(typeof data == "undefined") {
      return "-";
    }
    else if(typeof data == "number") {
      return  data.toString();
    }
    else {
      return data;
    }
  }
}
