--AER Aggregated Data

WITH allAERs as (SELECT account_id, aer.year reporting_year, aer.data aer_data FROM rpt_aer aer
UNION ALL
SELECT  CAST(rr.resource_id AS BIGINT) account_id, (rt.payload ->> 'reportingYear')::int reporting_year, rt.payload aer_data FROM request r JOIN request_type reqType on reqType.id = r.type_id
JOIN request_task rt on r.id = rt.request_id JOIN request_task_type rtt on rtt.id = rt.type_id JOIN request_resource rr on (r.id = rr.request_id AND rr.resource_type = 'ACCOUNT')
WHERE reqType.code = 'AER' AND rtt.code = 'AER_APPLICATION_REVIEW'
),sectionOperatorDetails
AS (
SELECT a.id account_id, a.business_id "Account Id", a.name "Account name", am.imo_number "IMO", am.status "Account status", ars.status "Reporting status", p.id "EMP ID", aer.reporting_year "Reporting year",
CASE p.data -> 'emissionsMonitoringPlan' -> 'operatorDetails' -> 'organisationStructure' ->> 'legalStatusType'
WHEN 'LIMITED_COMPANY' THEN 'Limited Company' WHEN 'INDIVIDUAL' THEN 'Individual' WHEN 'PARTNERSHIP' THEN 'Partnership' ELSE p.data -> 'emissionsMonitoringPlan' -> 'operatorDetails' -> 'organisationStructure' ->> 'legalStatusType'
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
WHERE ars.year = aer.reporting_year ),
ships AS (
    SELECT
        account_id,
        reporting_year,
        s.details ->> 'imoNumber' AS imo_number,
        s.details ->> 'name' AS ship_name
    FROM allAERs
    CROSS JOIN jsonb_to_recordset(aer_data -> 'aer' -> 'emissions' -> 'ships') AS s(details jsonb)
),aggregated_data
AS (
SELECT account_id, reporting_year, "imoNumber" imoShip, "totalEmissionsFromVoyagesAndPorts"->> 'total' totalEmissionsFromVoyagesAndPorts, "lessCapturedCo2"->> 'total' lessCapturedCo2,
"lessVoyagesNotInScope"->>'total' lessVoyagesNotInScope, "totalShipEmissions" totalShipEmissions, "lessIslandFerryDeduction"->>'total' lessIslandFerryDeduction,
"less5PercentIceClassDeduction"->>'total' less5PercentIceClassDeduction, "surrenderEmissions" surrenderEmissions
FROM allAERs, jsonb_to_recordset(aer_data -> 'aer' -> 'aggregatedData' -> 'emissions')
AS v("imoNumber" varchar, "totalEmissionsFromVoyagesAndPorts" jsonb, "lessCapturedCo2" jsonb, "lessVoyagesNotInScope" jsonb, "totalShipEmissions" numeric,
    "lessIslandFerryDeduction" jsonb, "less5PercentIceClassDeduction" jsonb, "surrenderEmissions" numeric))
SELECT "Account Id", "Account name", "IMO", "Account status", "Reporting year" "Reporting Year",  "Reporting status", "EMP ID", o.legalStatus "Legal status",
s.ship_name "Ship name", imoShip "Ship IMO Number",
totalEmissionsFromVoyagesAndPorts "Total emissions from voyages and in port", lessCapturedCo2 "Less captured CO2",
lessVoyagesNotInScope "Less voyages not in scope", totalShipEmissions "Total ship emissions", lessIslandFerryDeduction "Less small island ferry deduction",
less5PercentIceClassDeduction "Less 5% ice class deduction", surrenderEmissions "Emissions figure for surrender"
FROM sectionOperatorDetails o
JOIN aggregated_data d
ON o.account_id = d.account_id AND o."Reporting year" = d.reporting_year
JOIN ships s ON s.account_id = d.account_id AND s.reporting_year = d.reporting_year AND s.imo_number = d.imoShip
-- Uncomment the line below for filtering by reporting year and IMO number
-- WHERE o."Reporting year" = 2024 AND o."IMO" = '0000001'
;