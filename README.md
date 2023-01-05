# Controls Framework

## Purpose
This application has been built to create a UI for external customers to view our Security Controls Framework. In addition, this application is open-sourced allowing customers to make their own customizations to the enchance their experience.

## Running the site locally
In order to run the site locally for development purposes please do the following:
1. Clone the repo to a known location on your machine.
2. Open a terminal and navigate to the repo folder. 
3. Run 'npm install'. If you get an error at this step that means you do not have node installed. Please go download the latest LTS version to continue. Once downloaded, rerun the installation command.
https://nodejs.org/en/download/
4. When installation is complete, run 'npm run ng serve'. This will create a local server instance for the application. 
The 'ng' command will not work on its own unless Angular CLI is installed
5. Navigate your browser to localhost:4200

## Adding Angular Material
Angular Material is a pre-built style guide created and owned by the Angular team (Google). If you see an error that this is missing then you will need to open your terminal in this folder and run: npm i @angular/material.

## Application Structure
This Angular application structure follows the best practices within the industry. Each essential page/component will be located within the /app folder towards the highest level. If the project expands then these can be broken down into subfolders as needed. The '/shared' folder is intended to house components that are being used throughout the application. For example, this includes the header and footer components. 

When developing new features within the application it is best to breakdown the components when applicable but do not over complicate the solution for your coworkers. 

## Adding new components
To add a new component it is best practice to use the Angular CLI. Open the project within your terminal and run 'ng g componentnamehere' (the 'g' is short for generate). If you wish for the component to be created under a specific folder such as 'shared' then run 'ng g shared/componentnamehere'. 

If you used the CLI to create the new component then it will automatically be imported into the app.module.ts file and ready for you to use. Each component should have an html, stylesheet, spec, and ts file. The 'ts' file will bring associate each of these files with each other. If you manually created or copied over the component then you will need to do the app.module import yourself. Navigate to the app.module.ts file and import the ts file that is being exported. Then add that component name into the module imports listed below. At this point you are ready to begin using the component throughout the application by adding the selector tag within the HTML code. 

## Build
Run `npm run ng build` to build the project. The build artifacts will be stored in the `dist/` directory. This step handles the "tree-shaking" and compilation of code. Essentially, Angular takes the large folder and then removes everything not being used and turns the Typescript into Javascript.

## Managing custom roles - only available when running locally
Roles can be added and deleted in this application. When running locally the application will allow the user to perform these actions without having to edit code. 
1. Either follow the required schema or download the Control and TR csv templates from the application.
2. Enter the your custom Role information into each column and save the file to the '/assets' folder. 
3. Navigate to the 'manage' page and enter the details for your new role when prompted.
4. A file will be created once you click submit. Save this file to the '/assets' folder as well and overwrite the existing file.

Notes:
Each role filename should end with: ' - TR/Control'. Notice there a single space on each side of the '-'

## Sharing customizations across your organization
1. Create a fork of the repository and name it for your company.
2. Make changes while working in the copied repository.
3. Push changes up to the forked repository and instruct colleagues to pull updates as needed.
