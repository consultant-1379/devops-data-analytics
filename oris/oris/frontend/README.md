# DODA

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.2.

## Get Started

### Clone the repository
```shell
git clone https://{SIGNUM}@gerrit-gamma.gic.ericsson.se/a/OSS/com.ericsson.nm.internaltools.devops/devops-data-analytics && (cd devops-data-analytics && mkdir -p .git/hooks && curl -Lo `git rev-parse --git-dir`/hooks/commit-msg https://zikrnka@gerrit-gamma.gic.ericsson.se/tools/hooks/commit-msg; chmod +x `git rev-parse --git-dir`/hooks/commit-msg)
cd devops-data-analytics/doda/devops-data-analytics/ui/frontend
```
### Prerequisite
EDS will have to be configured for your system to be able to run the project locally. Please note, this is a one time configuration. If you have this configured already, please skip the prerequisite.
Please follow the guide [here](https://eds.internal.ericsson.com/resources/developer-assets/integrations#eds-angular) to set the NPM configuration needed for EDS.

```shell
npm config set @eds:registry https://arm.rnd.ki.sw.ericsson.se/artifactory/api/npm/proj-eds-npm-local
```

### Install npm packages
Install the `npm` packages described in the `package.json` and verify that it works:

```shell
npm install
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
