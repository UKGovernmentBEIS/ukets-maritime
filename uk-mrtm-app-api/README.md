# UK MRTM API application

The UK MRTM API is a Java(SpringBoot) application.

## Structure

## Running the application

You can run the Spring Boot application by typing:

    $ mvn clean spring-boot:run

or

    $ ./_runme.sh

You can then access the final jar file that contains the API here :

    uk-mrtm-app-api\target

For the build to succeed uk-netz-swagger-coverage-maven-plugin must have been built prior to building the UK MRTM API application

## REST API Documentation

The API is documented using Swagger 3.

After running the application, the documentation is available here:

- http://localhost:8080/api/swagger-ui/index.html (UI)
- http://localhost:8080/api/v3/api-docs (JSON)

### Actuator

Actuator can be accessed in:

```
http://localhost:8080/actuator
```

Note that the actuator is not secured by default because it is not meant to be
exposed to the public internet but only be accessible from the internal
network.

### Feature flags

Feature flag feature-flag.disabledWorkflows for disabling workflows has been implemented and can take as a value comma-separated workflows(RequestType) that need to be disabled. (Only user initiated workflows are taken under consideration)

### Logging

By default, logging to json format is configured through log4j2-json.xml but default console logging can be chosen by setting LOG4J2_CONFIG_FILE env var to log4j2-local.xml.

Unauthenticated API calls are not logged(RestLoggingFilter is applied after security filters in order to be able to inject user related info in authenticated API calls) so explicit logging should be added for these calls.

## Camunda admin

### REST API

Camunda rest is used to manage camunda processes. It is unauthenticated and can be accessed at /api/admin/camunda-api.

Documentation can be found at
- https://docs.camunda.org/manual/latest/reference/rest/

### WEB APP

Camunda webapp consists of 3 different web apps:
- cockpit: an administration interface for processes and decisions
- tasklist: provides an interface to process user tasks
- admin: is used to administer users, groups and their authorizations 

It is authenticated through keycloak's master realm and can be accessed at /api/admin/camunda-web.

Documentation can be found at
- https://camunda.com/platform-7/cockpit/
- https://camunda.com/platform/tasklist/
- https://github.com/camunda/camunda-bpm-platform/tree/master/webapps


# Use in a New project
- Change banner.txt
- rename package from netz to the new project name
- after the packages have been updated to the new name space, global search with 'netz' keyword should be performed to update where necessary (e.g RequestTaskMapper, PaymentPayloadMapper, RfiMapper, RdeMapper, AuthorizationRule (look for hql queries using the fully qualified class names))
- Some default/dummy implementations have been provided in NETZ for the application to be able to deploy. These will have to be replaced with project-specific implementations:
  - NetzAccountStatus enum. Should be replaced with a real enum that will contain the real account statuses of the new project.
  - NetzEmissionTradingScheme enum. Should be replaced with a real enum that will contain the real emission trading schemes of the new project.
  - NetzAccount entity. Should be replaced with the real project account entity. At minimum should contain properties for the status and the emission trading scheme
  - NetzAccountRepository
  - NetzApprovedAccountQueryService
  - NetzRegulatorPermissionsAdapter
  - TestItemResponseService
  - TestDocumentTemplateCommonParamsAbstractProvider
  - TestOutstandingRequestTasksReportService
  - all the test payload classes (prefixed with *Test) that reside under uk.gov.netz.api.workflow.request.flow package should be removed. They are here to demonstrate how to provide them in their respective jackson types provider class and swagger scheme provider.
- The project-specific concrete payload classes (subclasses of RequestPayload, RequestTaskPayload, RequestTaskActionPayload, RequestCreateActionPayload, RequestActionPayload, RequestMetadata) should be defined in their respective *TypesProvider class. For example, the classes that extend the RequestPayload class, should be added in the RequestPayloadTypesProvider class.
- The project-specific concrete payload classes (subclasses of RequestPayload, RequestTaskPayload, RequestTaskActionPayload, RequestCreateActionPayload, RequestActionPayload, RequestMetadata) should be added in their respective swagger scheme *SchemesProvider class. For example, the classes that extend the RequestPayload class, should be added in the RequestPayloadSchemasProvider class.
- The project-specific concrete MiReportResult classes should be defined in MiReportResultTypesSchemasProvider and in a JsonSubTypesProvider similar to MiReportResultTypesProvider
- The project-specific concrete MiReportParams classes should be defined in MiReportParamsSchemasProvider and in a JsonSubTypesProvider similar to MiReportParamsTypesProvider


- Dockerfile
- Jenkinsfile
- docker-compose.yml

## Abstractions provided

### Common
- EmissionTradingScheme

### Competent Authority
- a script similar to competent_authority.xml with the correct emails will be needed

### Account
- AccountStatus
- Account entity
- AccountBaseRepository
- ApprovedAccountQueryAbstractService
- implement CompanyInformationController to call CompanyInformationService with appropriate model if companies-house integration is needed

### Companies-house
- In case companies house integration is needed uk-netz-app-api-companieshouse should be added as dependency and the following properties must be set
  - company-information-service.url
  - company-information-service.api-key

### Authorisation
- review au_authority.xml, au_authorization_rules.xml and keep only necessary entries
- implement AbstarctRegulatorPermissionsAdapter

### Request
- RequestType: public static methods
- RequestTaskType: public static methods
- RequestCreateByAccountValidator, ProcessRequestCreateAspect: filter account create flow?
- DocumentTemplateCommonParamsProvider, remove TestDocumentTemplateCommonParamsAbstractProvider
- ItemResponseService, remove TestItemResponseService
- ItemDTO

### MiReports
- implement MiReportSystemGenerator for all reports applicable to the project:
  - AccountAssignedRegulatorSiteContactReportGenerator, AccountAssignedRegulatorSiteContactsRepository (extend AccountAssignedRegulatorSiteContact if additional properties needed)
  - AccountUsersContactsReportGenerator, AccountUsersContactsRepository (extend AccountUserContact if additional properties needed)
  - OutstandingRequestTasksReportGenerator, OutstandingRequestTasksRepository (extend OutstandingRequestTask if additional properties needed)
  - OutstandingRequestTasksReportGenerator, OutstandingRequestTasksReportService(implement and remove TestOutstandingRequestTasksReportService), OutstandingRequestTasksRepository (extend OutstandingRequestTask if additional properties needed)
- Repositories for predefined reports (e.g. AccountAssignedRegulatorSiteContactsRepository)
- update mi_reports_views.sql to include all project related db tables
- a script to include all applicable reports per CA in mi_report table
- add newly introduced data types in MiReportResultTypesSchemasProvider, MiReportParamsSchemasProvider to be made available in swagger
- introduce new JsonSubTypesProvider for newly introduced data types similar to MiReportResultTypesProvider and MiReportParamsTypesProvider

### Notification
- database entries with correct content for all notifications (NotificationTemplateName)

### application.properties
- spring.datasource.name: same with POSTGRES_DB in docker_compose.yml (API_DB_NAME)
- report-datasource
- jwt.claim.audience

- keycloak.realm will be uk-pmrv if sso is needed
- keycloak.client-id
- keycloak.client-secret (NETZ_APP_API_CLIENT_SECRET change name and sync with keycloak variable)
- plugin.identity.keycloak.clientId
- plugin.identity.keycloak.clientSecret(PMRV_CAMUNDA_IDENTITY_SERVICE_SECRET change name and sync with keycloak variable)

- security.unauthenticated-apis add the apis that are unauthenticated

- cloudwatch.namespace

- UI_ANALYTICS_MEASUREMENTID
- UI_ANALYTICS_PROPERTYID

## KEYCLOAK
- new client for app-api (similar to 23_create_uk_cca_app_api_client.sh,  07_update_client_uk_cca_app_api.sh)
- new client for app-web (similar to 24_create_uk_cca_web_app_client.sh, 06_update_client_uk_cca_web_app.sh)
- new client for camunda-admin (similar to 25_create_uk_cca_camunda_identity_service_client.sh, 08_update_uk_cca_camunda_identity_service_client.sh)


## Liquibase CLI
If you want to run Liquibase CLI commands you can:  
- set the username and password in liquibase.properties file (usernmame:username, password:password)
- run the command you want (for example mvn liquibase:update)