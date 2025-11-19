--AER ships
WITH allAERs as (SELECT account_id, aer.year reporting_year, aer.data aer_data FROM rpt_aer aer
UNION ALL
SELECT  CAST(rr.resource_id AS BIGINT) account_id, (rt.payload ->> 'reportingYear')::int reporting_year, rt.payload aer_data FROM request r JOIN request_type reqType on reqType.id = r.type_id
JOIN request_task rt on r.id = rt.request_id JOIN request_task_type rtt on rtt.id = rt.type_id JOIN request_resource rr on (r.id = rr.request_id AND rr.resource_type = 'ACCOUNT')
WHERE reqType.code = 'AER' AND rtt.code = 'AER_APPLICATION_REVIEW'
), sectionOperatorDetails
AS (
SELECT a.id account_id, a.business_id "Account Id", a.name "Account name", am.imo_number "IMO", am.status "Account status", ars.status "Reporting status", p.id "EMP ID", aer.reporting_year "Reporting year",
CASE p.data -> 'emissionsMonitoringPlan' -> 'operatorDetails' -> 'organisationStructure' ->> 'legalStatusType'
WHEN 'LIMITED_COMPANY'
THEN 'Limited Company'
WHEN 'INDIVIDUAL'
THEN 'Individual'
WHEN 'PARTNERSHIP'
THEN 'Partnership'
ELSE p.data -> 'emissionsMonitoringPlan' -> 'operatorDetails' -> 'organisationStructure' ->> 'legalStatusType'
END legalStatus, p.data
FROM account a
JOIN account_mrtm am
ON am.id = a.id
LEFT
JOIN emp p
ON p.account_id = a.id
JOIN allAERs aer
ON a.id = aer.account_id
LEFT
JOIN account_reporting_status ars
ON a.id = ars.account_id
WHERE (
-- Uncomment the line below for filtering by IMO number and year
-- (aer.reporting_year = 2024 AND am.imo_Number = '3082184') AND
ars.year = aer.reporting_year )), shipEmissions
AS (
SELECT account_id, reporting_year AS reporting_year, "details", "fuelsAndEmissionsFactors", "emissionsSources", "uncertaintyLevel", "derogations"
FROM allAERs, jsonb_to_recordset(aer_data -> 'aer' -> 'emissions' -> 'ships')
AS t("details" jsonb, "fuelsAndEmissionsFactors" jsonb, "emissionsSources" jsonb, "uncertaintyLevel" jsonb, "derogations" jsonb)), shipDetailsSection
AS (
SELECT account_id, reporting_year, details ->> 'imoNumber' imoShip, details ->> 'name' name, details ->> 'type' type, details ->> 'grossTonnage' grossTonnage, details ->> 'flagState' flagState, details ->> 'iceClass' iceClass, details ->> 'natureOfReportingResponsibility' natureOfReportingResponsibility,
(CASE details ->> 'allYear' WHEN 'true' THEN concat('01/01/', reporting_year) ELSE details->> 'from' END) fromDate, (CASE details ->> 'allYear' WHEN 'true' THEN concat('31/12/', reporting_year) ELSE details->> 'to' END) toDate
FROM shipEmissions), fuelsEmissionsFactorsSection
AS (
SELECT account_id, reporting_year, "details" ->> 'imoNumber' imoShip, origin, type, name, "carbonDioxide", "methane", "nitrousOxide"
FROM shipEmissions, jsonb_to_recordset("fuelsAndEmissionsFactors")
AS f("origin" varchar, "type" varchar, "name" varchar, "carbonDioxide" numeric, "methane" numeric, "nitrousOxide" numeric)), emissionsSourcesSection
AS (
SELECT account_id, reporting_year, "referenceNumber", "details" ->> 'imoNumber' imoShip, s.name sourceName, s.type sourceType, "sourceClass", "methaneSlip", ( concat_ws('/', f.origin, f.type, f.name) )
AS fuelTypes,
    (string_agg(CASE e.value WHEN 'BDN' THEN 'Method A' WHEN 'BUNKER_TANK' THEN 'Method B' WHEN 'FLOW_METERS' THEN 'Method C' WHEN 'DIRECT' THEN 'Method D' ELSE e.value END, ', '))
AS monitoringMethod
FROM shipEmissions, jsonb_to_recordset("emissionsSources")
AS s("referenceNumber" varchar, "name" varchar, "type" varchar, "sourceClass" varchar, "fuelDetails" jsonb, "monitoringMethod" jsonb), jsonb_to_recordset("fuelDetails")
AS f("origin" varchar, "type" varchar, "name" varchar, "methaneSlip" numeric), jsonb_array_elements_text(s."monitoringMethod")
AS e(value)
GROUP BY s.name, "referenceNumber", "details" ->> 'imoNumber', account_id, reporting_year, s.type, "sourceClass", "methaneSlip", f.origin, f.type, f.name), uncertaintyLevelSection
AS (
SELECT account_id, reporting_year, "details" ->> 'imoNumber' imoShip, concat_ws(': ',
CASE "monitoringMethod"
WHEN 'BDN'
THEN 'Method A'
WHEN 'BUNKER_TANK'
THEN 'Method B'
WHEN 'FLOW_METERS'
THEN 'Method C'
WHEN 'DIRECT'
THEN 'Method D'
ELSE "monitoringMethod"
END, "methodApproach") monitoringMethodApproach, u.value monitoringMethodValue
FROM shipEmissions, jsonb_to_recordset("uncertaintyLevel")
AS u("monitoringMethod" varchar, "methodApproach" varchar, "value" numeric)), derogationsSection
AS (SELECT account_id, reporting_year,"details" ->> 'imoNumber' imoShip,
CASE "derogations" ->> 'exceptionFromPerVoyageMonitoring' WHEN 'true' THEN 'Yes' ELSE 'No' END exceptionFromPerVoyageMonitoring,
CASE "derogations" ->> 'carbonCaptureAndStorageReduction' WHEN 'true' THEN 'Yes' ELSE 'No' END  carbonCaptureAndStorageReduction,
CASE "derogations" ->> 'smallIslandFerryOperatorReduction' WHEN 'true' THEN 'Yes' ELSE 'No' END  smallIslandFerryOperatorReduction
FROM shipEmissions)
(SELECT "Account Id", "Account name", "IMO", "Account status", "Reporting year" "Reporting Year",  "Reporting status", "EMP ID", o.legalStatus "Legal status", 0 sectionId, 'Account details' section, null "IMO Ship", null "Ship Name", null "Ship Type", cast(null
AS numeric) "Gross Tonage", null "Flag State", null "Ice class", null "Nature of reporting responsibility",null "Reporting Date From", null "Reporting Date To", null "Origin", null "Type", null "Name", cast(null
AS numeric) "Tank to Wake emission factor for carbon dioxide", cast(null
AS numeric) "Tank to Wake emission factor for methane", cast(null
AS numeric) "Tank to Wake emission factor for nitrous oxide", null "Emission source reference number", null "Unique emission source name", null "Emission source type", null "Emission source class", null "Potential fuel types used", cast(null
AS numeric) "Methane slip (%)", null "Monitoring Method", null "Approach used", cast(null
AS numeric) "Uncertainty value (%)", null  "Do you have an exemption from per voyage monitoring?", null  "Claim an emissions reduction for carbon capture and storage?", null  "Claiming a small island ferry operator surrender reduction?"
FROM sectionOperatorDetails o
UNION ALL
SELECT "Account Id", "Account name", "IMO", "Account status", cast(null as numeric) "Reporting Year", "Reporting status", "EMP ID", o.legalStatus "Legal status", 1 sectionId, 'Ship details' section, imoShip "IMO Ship", name "Ship Name", type "Ship Type", cast(grossTonnage
AS numeric) "Gross Tonage", flagState "Flag State", iceClass "Ice class", natureOfReportingResponsibility "Nature of reporting responsibility", d.fromDate "Reporting Date From", d.toDate "Reporting Date To", null "Origin", null "Type", null "Name", cast(null
AS numeric) "Tank to Wake emission factor for carbon dioxide", cast(null
AS numeric) "Tank to Wake emission factor for methane", cast(null
AS numeric) "Tank to Wake emission factor for nitrous oxide",null "Emission source reference number", null "Unique emission source name", null "Emission source type", null "Emission source class", null "Potential fuel types used", cast(null
AS numeric) "Methane slip (%)", null "Monitoring Method", null "Approach used", cast(null
AS numeric) "Uncertainty value (%)", null  "Do you have an exemption from per voyage monitoring?", null  "Claim an emissions reduction for carbon capture and storage?", null  "Claiming a small island ferry operator surrender reduction?"
FROM sectionOperatorDetails o
JOIN shipDetailsSection d
ON o.account_id = d.account_id AND o."Reporting year" = d.reporting_year
UNION ALL
SELECT "Account Id", "Account name", "IMO", "Account status", cast(null as numeric) "Reporting Year", "Reporting status", "EMP ID", o.legalStatus "Legal status", 2 sectionId, 'Fuels and emission factors' section, imoShip "IMO Ship", null "Ship Name", null "Ship Type", cast(null
AS numeric) "Gross Tonage", null "Flag State", null "Ice class", null "Nature of reporting responsibility", null "Reporting Date From", null "Reporting Date To", origin "Origin", type "Type", name "Name", cast("carbonDioxide"
AS numeric) "Tank to Wake emission factor for carbon dioxide", cast(methane
AS numeric) "Tank to Wake emission factor for methane", cast("nitrousOxide"
AS numeric) "Tank to Wake emission factor for nitrous oxide", null "Emission source reference number", null "Unique emission source name", null "Emission source type", null "Emission source class", null "Potential fuel types used", cast(null
AS numeric) "Methane slip (%)", null "Monitoring Method", null "Approach used", cast(null
AS numeric) "Uncertainty value (%)", null  "Do you have an exemption from per voyage monitoring?", null  "Claim an emissions reduction for carbon capture and storage?", null  "Claiming a small island ferry operator surrender reduction?"
FROM sectionOperatorDetails o
JOIN fuelsEmissionsFactorsSection d
ON o.account_id = d.account_id AND o."Reporting year" = d.reporting_year
UNION ALL
SELECT "Account Id", "Account name", "IMO", "Account status", cast(null as numeric) "Reporting Year", "Reporting status", "EMP ID", o.legalStatus "Legal status", 3 sectionId, 'Emission sources' section, imoShip "IMO Ship", null "Ship Name", null "Ship Type", cast(null
AS numeric) "Gross Tonage", null "Flag State", null "Ice class", null "Nature of reporting responsibility",null "Reporting Date From", null "Reporting Date To", null "Origin", null "Type", null "Name", cast(null
AS numeric) "Tank to Wake emission factor for carbon dioxide", cast(null
AS numeric) "Tank to Wake emission factor for methane", cast(null
AS numeric) "Tank to Wake emission factor for nitrous oxide", "referenceNumber" "Emission source reference number", sourceName "Unique emission source name", sourceType "Emission source type", "sourceClass" "Emission source class", fuelTypes "Potential fuel types used", "methaneSlip" "Methane slip (%)", monitoringMethod "Monitoring Method", null "Approach used", cast(null
AS numeric) "Uncertainty value (%)", null  "Do you have an exemption from per voyage monitoring?", null  "Claim an emissions reduction for carbon capture and storage?", null  "Claiming a small island ferry operator surrender reduction?"
FROM sectionOperatorDetails o
JOIN emissionsSourcesSection s
ON o.account_id = s.account_id AND o."Reporting year" = s.reporting_year
UNION ALL
SELECT "Account Id", "Account name", "IMO", "Account status", cast(null as numeric) "Reporting Year", "Reporting status", "EMP ID", o.legalStatus "Legal status", 4 sectionId, 'Uncertainty level' section, imoShip "IMO Ship", null "Ship Name", null "Ship Type", cast(null
AS numeric) "Gross Tonage", null "Flag State", null "Ice class", null "Nature of reporting responsibility",null "Reporting Date From", null "Reporting Date To", null "Origin", null "Type", null "Name", cast(null
AS numeric) "Tank to Wake emission factor for carbon dioxide", cast(null
AS numeric) "Tank to Wake emission factor for methane", cast(null
AS numeric) "Tank to Wake emission factor for nitrous oxide", null "Emission source reference number", null "Unique emission source name", null "Emission source type", null "Emission source class", null "Potential fuel types used", cast(null
AS numeric) "Methane slip (%)", null "Monitoring Method",       monitoringMethodApproach "Approach used", monitoringMethodValue    "Uncertainty value (%)", null  "Do you have an exemption from per voyage monitoring?", null  "Claim an emissions reduction for carbon capture and storage?", null  "Claiming a small island ferry operator surrender reduction?"
FROM sectionOperatorDetails o
JOIN uncertaintyLevelSection s
ON o.account_id = s.account_id AND o."Reporting year" = s.reporting_year
UNION ALL
SELECT "Account Id", "Account name", "IMO", "Account status", cast(null as numeric) "Reporting Year", "Reporting status", "EMP ID", o.legalStatus "Legal status", 5 sectionId, 'Derogations' section, imoShip "IMO Ship", null "Ship Name", null "Ship Type", cast(null
AS numeric) "Gross Tonage", null "Flag State", null "Ice class", null "Nature of reporting responsibility",null "Reporting Date From", null "Reporting Date To", null "Origin", null "Type", null "Name", cast(null
AS numeric) "Tank to Wake emission factor for carbon dioxide", cast(null
AS numeric) "Tank to Wake emission factor for methane", cast(null
AS numeric) "Tank to Wake emission factor for nitrous oxide", null "Emission source reference number", null "Unique emission source name", null "Emission source type", null "Emission source class", null "Potential fuel types used", cast(null
AS numeric) "Methane slip (%)", null "Monitoring Method", null "Approach used", cast(null
AS numeric) "Uncertainty value (%)", exceptionFromPerVoyageMonitoring  "Do you have an exemption from per voyage monitoring?", carbonCaptureAndStorageReduction  "Claim an emissions reduction for carbon capture and storage?", smallIslandFerryOperatorReduction  "Claiming a small island ferry operator surrender reduction?"
FROM sectionOperatorDetails o
JOIN derogationsSection s
ON o.account_id = s.account_id AND o."Reporting year" = s.reporting_year)
;