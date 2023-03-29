import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-download-file-modal',
  templateUrl: './download-file-modal.component.html',
  styleUrls: ['./download-file-modal.component.scss']
})
export class DownloadFileModalComponent implements OnInit {
  selectedFormat = ".CSV";
  formats = [".CSV", ".DOC", ".TXT"];
  durationInSeconds = 5;
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  constructor(
    public dialogRef: MatDialogRef<DownloadFileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
    }) {
      if (!this.setting.element.dynamicDownload) {
        this.setting.element.dynamicDownload = document.createElement('a');
      }
      const element = this.setting.element.dynamicDownload;
      const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
      element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
      element.setAttribute('download', arg.fileName);

      var event = new MouseEvent("click");
      element.dispatchEvent(event);
  }

  downloadData() {
    if (this.data.origin == "Role") {
      this.downloadData_Roles();
    } else if (this.data.origin == "Domain") {
      this.downloadData_Domain();
    } else if (this.data.origin == "Compliance") {
      this.downloadData_Compliance();
    }
  }

  downloadData_Domain() {
    let fileType;
    if (this.selectedFormat == ".DOC") {
      fileType = ".doc";
    } else if (this.selectedFormat == ".TXT") {
      fileType = ".txt";
    } else {
      fileType = ".csv";
    }

    let csvData = [];
    let dwldLink = document.createElement("a");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }

    if (this.data.view == "CONTROL") {
      dwldLink.setAttribute("download", this.data.name + " - CONTROL" + fileType);
      csvData.push(this.prepareDomainControlCSV(fileType));
    } else if (this.data.view == "TR") {
      csvData.push(this.prepareDomainTRCSV(fileType));
      dwldLink.setAttribute("download", this.data.name + " - TR" + fileType);
    }

    if (this.data.view == "TR_Controls_Mapping") {
      this.downloadMapping(fileType);
    } else {
      let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
      let url = URL.createObjectURL(blob);
      dwldLink.setAttribute("href", url);
      dwldLink.click();
    }
    document.body.removeChild(dwldLink);
    this.closeDialog();
    this._snackBar.openFromComponent(DownloadSnackBarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  prepareDomainControlCSV(format) {
    let data = this.data.file;
    let arrHeader = ["Domain Name", "Domain", "Control_ID", "Control_Desc", "Control_Scope", "Control_Owner", "Control_Operator", "Control_Type", "Control_Type"];
    let csvData = this.ConvertToCSV(data, arrHeader, 'CONTROL', format);
    return csvData;
  }

  prepareDomainTRCSV(format) {
    let data = this.data.file;
    let arrHeader = ["Domain Name", "Domain", "TR_ID", "Sub_TR_Order", "Sub_TR_Indent", "Sub_TR_ID", "TR_Description", "TR_Scope"];
    let csvData = this.ConvertToCSV(data, arrHeader, 'TR', format);
    return csvData;
  }

  ConvertToCSV(objArray, headerList, type, format) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    row = 'S.No,';
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

  downloadData_Roles() {
    let title = this.data.name;
    if (title == "Full Framework") {
      title = "CISO";
    }
    if (this.selectedFormat == ".DOC") {
      if (this.data.view == "CONTROL") {
        this.http.get("assets/" + title + "%20-%20CONTROL.csv", {responseType: 'text'})
        .subscribe(
            data => {
              this.dyanmicDownloadByHtmlTag({
                fileName: title + ' - CONTROL.doc',
                text: JSON.stringify(data)
              });
            },
            error => {
              console.log(error);
            }
        );
      } else if (this.data.view == "TR") {
        this.http.get("assets/" + title + "%20-%20TR.csv", {responseType: 'text'})
        .subscribe(
            data => {
              this.dyanmicDownloadByHtmlTag({
                fileName: title + ' - TR.doc',
                text: JSON.stringify(data)
              });
            },
            error => {
              console.log(error);
            }
        );
      } else if (this.data.view == "TR_Controls_Mapping") {
        this.downloadMapping(".doc");
      }
    } else if (this.selectedFormat == ".TXT") {
      if (this.data.view == "CONTROL") {
        this.http.get("assets/" + title + "%20-%20CONTROL.csv", {responseType: 'text'})
        .subscribe(
            data => {
              this.dyanmicDownloadByHtmlTag({
                fileName: title + ' - CONTROL.txt',
                text: JSON.stringify(data)
              });
            },
            error => {
              console.log(error);
            }
        );
      } else if (this.data.view == "TR") {
        this.http.get("assets/" + title + "%20-%20TR.csv", {responseType: 'text'})
        .subscribe(
            data => {
              this.dyanmicDownloadByHtmlTag({
                fileName: title + ' - TR.txt',
                text: JSON.stringify(data)
              });
            },
            error => {
              console.log(error);
            }
        );
      } else if (this.data.view == "TR_Controls_Mapping") {
        this.downloadMapping(".txt");
      }
    } else {
      if (this.data.view == "CONTROL") {
        window.open("assets/" + title + "%20-%20CONTROL.csv");
      } else if (this.data.view == "TR") {
        window.open("assets/" + title + "%20-%20TR.csv");
      } else if (this.data.view == "TR_Controls_Mapping") {
        this.downloadMapping(".csv");
      }
    }
    this.closeDialog();
    this._snackBar.openFromComponent(DownloadSnackBarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  downloadData_Compliance() {
    let title = this.data.view;
    if (this.selectedFormat == ".DOC") {
      if (this.data.view == "CS_to_CIS_Mapping") {
        this.http.get("assets/" + title + ".csv", {responseType: 'text'})
        .subscribe(
            data => {
              this.dyanmicDownloadByHtmlTag({
                fileName: title + '.doc',
                text: JSON.stringify(data)
              });
            },
            error => {
              console.log(error);
            }
        );
      } else if (this.data.view == "CS_to_NIST_CSF_Mapping") {
        this.http.get("assets/" + title + ".csv", {responseType: 'text'})
        .subscribe(
            data => {
              this.dyanmicDownloadByHtmlTag({
                fileName: title + '.doc',
                text: JSON.stringify(data)
              });
            },
            error => {
              console.log(error);
            }
        );
      }
    } else if (this.selectedFormat == ".TXT") {
      if (this.data.view == "CS_to_CIS_Mapping") {
        this.http.get("assets/" + title + ".csv", {responseType: 'text'})
        .subscribe(
            data => {
              this.dyanmicDownloadByHtmlTag({
                fileName: title + '.txt',
                text: JSON.stringify(data)
              });
            },
            error => {
              console.log(error);
            }
        );
      } else if (this.data.view == "CS_to_NIST_CSF_Mapping") {
        this.http.get("assets/" + title + ".csv", {responseType: 'text'})
        .subscribe(
            data => {
              this.dyanmicDownloadByHtmlTag({
                fileName: title + '.txt',
                text: JSON.stringify(data)
              });
            },
            error => {
              console.log(error);
            }
        );
      }
    } else {
      if (this.data.view == "CS_to_CIS_Mapping") {
        window.open("assets/" + title + ".csv");
      } else if (this.data.view == "CS_to_NIST_CSF_Mapping") {
        window.open("assets/" + title + ".csv");
      }
    }
    this.closeDialog();
    this._snackBar.openFromComponent(DownloadSnackBarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  downloadMapping(format) {
    if (format == ".csv") {
      window.open("assets/TR_Controls_Mapping.csv");
    } else if (format == ".doc") {
      this.http.get("assets/TR_Controls_Mapping.csv", {responseType: 'text'})
        .subscribe(
            data => {
              this.dyanmicDownloadByHtmlTag({
                fileName: 'TR_Controls_Mapping.doc',
                text: JSON.stringify(data)
              });
            },
            error => {
              console.log(error);
            }
        );
    } else if (format == ".txt") {
      this.http.get("assets/TR_Controls_Mapping.csv", {responseType: 'text'})
        .subscribe(
            data => {
              this.dyanmicDownloadByHtmlTag({
                fileName: 'TR_Controls_Mapping.txt',
                text: JSON.stringify(data)
              });
            },
            error => {
              console.log(error);
            }
        );
    }
  }

  closeDialog() {
    this.dialogRef.close({
      data: ''
    })
  }
}

@Component({
  selector: 'snack-bar',
  templateUrl: 'snackbar-download.html',
  styles: [
    `
    :host {
      display: flex;
    }

    .text {
      color: white;
      font-family: "Open Sans", "Segoe UI", Tahoma, Sans-Serif;
      font-size: 1rem;
    }
    
    #snackbar_action {
      float: right;
      font-weight: bold !important;
    }

    #snackbar_action:hover {
      cursor: pointer;
    }

    #snackbar_label {
      float: left;
    }
  `,
  ],
})
export class DownloadSnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
}