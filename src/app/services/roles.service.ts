import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesService {

    constructor(private http: HttpClient) {}

    roles_descriptions = [
        {"name": "Data Scientist Privacy Director", "description": "A data scientist is typically responsible for collecting, analyzing, and interpreting large amounts of data. While analyzing data, the data scientist looks for patterns or trends while trying to simplify data problems."},
        {"name": "HR Generalist Business Partner", "description": "A HR Generalist is typically responsible for administrative compliance-oriented tasks such as maintaining employee records, administering benefits and payroll, and providing employee self-service."},
        {"name": "Director of Physical Security", "description": "A Director of Physical Security is typically responsible for the physical protection and welfare of members and assets of an organization."},
        {"name": "Director of Crisis Management", "description": "A Director of Crisis Management is typically responsible for planning and leading the response to disasters and other emergencies. This person typically designs and tests procedures for the organization to be ready for such events."},
        {"name": "Patch Champion", "description": "A Patch Champion is typically a designated person responsible for ensuring that assets are patched in a timely manner per defined standards."},
        {"name": "Software Engineer Developer", "description": "This is a sample description."},
        {"name": "DevOps System Engineer", "description": "A System Engineer is typically responsible for designing, implementing and maintaining the information technology systems for an organization. Their duties include designing the basic computing infrastructure to accomplish key tasks, establishing networking rules for cybersecurity and troubleshooting network errors or other technical issues."},
        {"name": "Manager of Threat Detection", "description": "A Manager or Threat Detection is typically responsible for the organization’s threat framework to prevent cyber attacks, detect cyber threats, and respond to security incidents."},
        {"name": "Manager of Vulnerability Management", "description": "A Manager of Vulnerability Management is typically responsible for identifying, evaluating, treating, and reporting security vulnerabilities in systems and the software that runs on them."},
        {"name": "Director of Fraud", "description": "A Director of Fraud is typically responsible for setting fraud risk policies and driving cross-functional strategic initiatives to minimize fraud risk."},
        {"name": "VP of Risk Management", "description": "A VP of Risk Management is typically responsible for overseeing a company’s risk management framework and capabilities. This person effectively aggregates and communicates the company’s main operational risks to senior management and key governance forums."}
    ];

    getRoleDescriptions(){
        return this.http.get("./assets/roles_descriptions.json");
    }

    addRoleDescription(name, description) {
        let role = {"name": name, "description": description};
        this.roles_descriptions.push(role);
        console.log("updated list: " + JSON.stringify(this.roles_descriptions))
    }

    deleteRoleDescription(name) {
        
        for (let i = 0; i < this.roles_descriptions.length; i++) {
            console.log(name + " compared to " + this.roles_descriptions[i].name);
            if (name == this.roles_descriptions[i].name) {
                this.roles_descriptions.splice(i,1);
                console.log("Deleting role: " + name)
            }
        }
    }
}