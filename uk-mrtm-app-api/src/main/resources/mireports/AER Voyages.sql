--AER Voyages
WITH port_countries AS (
    SELECT 'AF' AS country_code, 'Afghanistan' AS name, 'INTERNATIONAL' AS port_type UNION ALL
    SELECT 'AL', 'Albania', 'INTERNATIONAL' UNION ALL
    SELECT 'DZ', 'Algeria', 'INTERNATIONAL' UNION ALL
    SELECT 'AS', 'American Samoa (USA)', 'INTERNATIONAL' UNION ALL
    SELECT 'AD', 'Andorra', 'INTERNATIONAL' UNION ALL
    SELECT 'AO', 'Angola', 'INTERNATIONAL' UNION ALL
    SELECT 'AI', 'Anguilla, UK', 'INTERNATIONAL' UNION ALL
    SELECT 'AG', 'Antigua and Barbuda', 'INTERNATIONAL' UNION ALL
    SELECT 'AR', 'Argentina', 'INTERNATIONAL' UNION ALL
    SELECT 'AM', 'Armenia', 'INTERNATIONAL' UNION ALL
    SELECT 'AW', 'Aruba (NL)', 'INTERNATIONAL' UNION ALL
    SELECT 'AU', 'Australia', 'INTERNATIONAL' UNION ALL
    SELECT 'AT', 'Austria', 'EU' UNION ALL
    SELECT 'AZ', 'Azerbaijan', 'INTERNATIONAL' UNION ALL
    SELECT 'BS', 'Bahamas', 'INTERNATIONAL' UNION ALL
    SELECT 'BH', 'Bahrain', 'INTERNATIONAL' UNION ALL
    SELECT 'BD', 'Bangladesh', 'INTERNATIONAL' UNION ALL
    SELECT 'BB', 'Barbados', 'INTERNATIONAL' UNION ALL
    SELECT 'BY', 'Belarus', 'INTERNATIONAL' UNION ALL
    SELECT 'BE', 'Belgium', 'EU' UNION ALL
    SELECT 'BZ', 'Belize', 'INTERNATIONAL' UNION ALL
    SELECT 'BJ', 'Benin', 'INTERNATIONAL' UNION ALL
    SELECT 'BM', 'Bermuda, UK', 'INTERNATIONAL' UNION ALL
    SELECT 'BO', 'Bolivia', 'INTERNATIONAL' UNION ALL
    SELECT 'BA', 'Bosnia and Herzegovina', 'INTERNATIONAL' UNION ALL
    SELECT 'BR', 'Brazil', 'INTERNATIONAL' UNION ALL
    SELECT 'VG', 'British Virgin Islands, UK', 'INTERNATIONAL' UNION ALL
    SELECT 'BN', 'Brunei Darussalam', 'INTERNATIONAL' UNION ALL
    SELECT 'BG', 'Bulgaria', 'EU' UNION ALL
    SELECT 'BI', 'Burundi', 'INTERNATIONAL' UNION ALL
    SELECT 'KH', 'Cambodia', 'INTERNATIONAL' UNION ALL
    SELECT 'CM', 'Cameroon', 'INTERNATIONAL' UNION ALL
    SELECT 'CA', 'Canada', 'INTERNATIONAL' UNION ALL
    SELECT 'CV', 'Cape Verde', 'INTERNATIONAL' UNION ALL
    SELECT 'KY', 'Cayman Islands, UK', 'INTERNATIONAL' UNION ALL
    SELECT 'CL', 'Chile', 'INTERNATIONAL' UNION ALL
    SELECT 'CN', 'China', 'INTERNATIONAL' UNION ALL
    SELECT 'CO', 'Colombia', 'INTERNATIONAL' UNION ALL
    SELECT 'KM', 'Comoros', 'INTERNATIONAL' UNION ALL
    SELECT 'CG', 'Congo', 'INTERNATIONAL' UNION ALL
    SELECT 'CD', 'Congo, the Democratic Republic of the', 'INTERNATIONAL' UNION ALL
    SELECT 'CK', 'Cook Islands', 'INTERNATIONAL' UNION ALL
    SELECT 'CR', 'Costa Rica', 'INTERNATIONAL' UNION ALL
    SELECT 'CI', 'Cote d''Ivoire', 'INTERNATIONAL' UNION ALL
    SELECT 'HR', 'Croatia', 'EU' UNION ALL
    SELECT 'CU', 'Cuba', 'INTERNATIONAL' UNION ALL
    SELECT 'AN', 'Curacao', 'INTERNATIONAL' UNION ALL
    SELECT 'CY', 'Cyprus', 'EU' UNION ALL
    SELECT 'CZ', 'Czech Republic', 'EU' UNION ALL
    SELECT 'DK', 'Denmark', 'EU' UNION ALL
    SELECT 'DJ', 'Djibouti', 'INTERNATIONAL' UNION ALL
    SELECT 'DM', 'Dominica', 'INTERNATIONAL' UNION ALL
    SELECT 'DO', 'Dominican Republic', 'INTERNATIONAL' UNION ALL
    SELECT 'EC', 'Ecuador', 'INTERNATIONAL' UNION ALL
    SELECT 'EG', 'Egypt', 'INTERNATIONAL' UNION ALL
    SELECT 'SV', 'El Salvador', 'INTERNATIONAL' UNION ALL
    SELECT 'GQ', 'Equatorial Guinea', 'INTERNATIONAL' UNION ALL
    SELECT 'ER', 'Eritrea', 'INTERNATIONAL' UNION ALL
    SELECT 'EE', 'Estonia', 'EU' UNION ALL
    SELECT 'ET', 'Ethiopia', 'INTERNATIONAL' UNION ALL
    SELECT 'FK', 'Falkland Islands, UK (Malvinas)', 'INTERNATIONAL' UNION ALL
    SELECT 'FO', 'Faroe Islands', 'INTERNATIONAL' UNION ALL
    SELECT 'FJ', 'Fiji', 'INTERNATIONAL' UNION ALL
    SELECT 'FI', 'Finland', 'EU' UNION ALL
    SELECT 'FR', 'France', 'EU' UNION ALL
    SELECT 'PF', 'French Polynesia (FR)', 'INTERNATIONAL' UNION ALL
    SELECT 'GA', 'Gabon', 'INTERNATIONAL' UNION ALL
    SELECT 'GM', 'Gambia', 'INTERNATIONAL' UNION ALL
    SELECT 'GE', 'Georgia', 'INTERNATIONAL' UNION ALL
    SELECT 'DE', 'Germany', 'EU' UNION ALL
    SELECT 'GH', 'Ghana', 'INTERNATIONAL' UNION ALL
    SELECT 'GI', 'Gibraltar, UK', 'INTERNATIONAL' UNION ALL
    SELECT 'GR', 'Greece', 'EU' UNION ALL
    SELECT 'GD', 'Grenada', 'INTERNATIONAL' UNION ALL
    SELECT 'GT', 'Guatemala', 'INTERNATIONAL' UNION ALL
    SELECT 'GG', 'Guernsey, UK', 'INTERNATIONAL' UNION ALL
    SELECT 'GN', 'Guinea', 'INTERNATIONAL' UNION ALL
    SELECT 'GW', 'Guinea-Bissau', 'INTERNATIONAL' UNION ALL
    SELECT 'GY', 'Guyana', 'INTERNATIONAL' UNION ALL
    SELECT 'HT', 'Haiti', 'INTERNATIONAL' UNION ALL
    SELECT 'HN', 'Honduras', 'INTERNATIONAL' UNION ALL
    SELECT 'HU', 'Hungary', 'EU' UNION ALL
    SELECT 'IS', 'Iceland', 'INTERNATIONAL' UNION ALL
    SELECT 'IN', 'India', 'INTERNATIONAL' UNION ALL
    SELECT 'ID', 'Indonesia', 'INTERNATIONAL' UNION ALL
    SELECT 'IR', 'Iran, Islamic Republic of' , 'INTERNATIONAL' UNION ALL
    SELECT 'IQ', 'Iraq', 'INTERNATIONAL' UNION ALL
    SELECT 'IE', 'Ireland', 'EU' UNION ALL
    SELECT 'IM', 'Isle of Man, UK', 'INTERNATIONAL' UNION ALL
    SELECT 'IL', 'Israel', 'INTERNATIONAL' UNION ALL
    SELECT 'IT', 'Italy', 'EU' UNION ALL
    SELECT 'JM', 'Jamaica', 'INTERNATIONAL' UNION ALL
    SELECT 'JP', 'Japan', 'INTERNATIONAL' UNION ALL
    SELECT 'JE', 'Jersey, UK', 'INTERNATIONAL' UNION ALL
    SELECT 'JO', 'Jordan', 'INTERNATIONAL' UNION ALL
    SELECT 'KZ', 'Kazakhstan', 'INTERNATIONAL' UNION ALL
    SELECT 'KE', 'Kenya', 'INTERNATIONAL' UNION ALL
    SELECT 'KI', 'Kiribati', 'INTERNATIONAL' UNION ALL
    SELECT 'KP', 'Korea, Democratic People''s Republic of', 'INTERNATIONAL' UNION ALL
    SELECT 'KR', 'Korea, Republic of', 'INTERNATIONAL' UNION ALL
    SELECT 'KW', 'Kuwait', 'INTERNATIONAL' UNION ALL
    SELECT 'KG', 'Kyrgyzstan', 'INTERNATIONAL' UNION ALL
    SELECT 'LA', 'Lao People''s Democratic Republic', 'INTERNATIONAL' AS type UNION ALL
    SELECT 'LV', 'Latvia', 'EU' UNION ALL
    SELECT 'LB', 'Lebanon', 'INTERNATIONAL' UNION ALL
    SELECT 'LR', 'Liberia', 'INTERNATIONAL' UNION ALL
    SELECT 'LY', 'Libya', 'INTERNATIONAL' UNION ALL
    SELECT 'LI', 'Liechtenstein', 'INTERNATIONAL' UNION ALL
    SELECT 'LT', 'Lithuania', 'EU' UNION ALL
    SELECT 'LU', 'Luxembourg', 'EU' UNION ALL
    SELECT 'MK', 'Macedonia, Former Yugoslav Republic of', 'INTERNATIONAL' UNION ALL
    SELECT 'MG', 'Madagascar', 'INTERNATIONAL' UNION ALL
    SELECT 'MW', 'Malawi', 'INTERNATIONAL' UNION ALL
    SELECT 'MY', 'Malaysia', 'INTERNATIONAL' UNION ALL
    SELECT 'MV', 'Maldives', 'INTERNATIONAL' UNION ALL
    SELECT 'ML', 'Mali', 'INTERNATIONAL' UNION ALL
    SELECT 'MT', 'Malta', 'EU' UNION ALL
    SELECT 'MH', 'Marshall Islands', 'INTERNATIONAL' UNION ALL
    SELECT 'MR', 'Mauritania', 'INTERNATIONAL' UNION ALL
    SELECT 'MU', 'Mauritius', 'INTERNATIONAL' UNION ALL
    SELECT 'MX', 'Mexico', 'INTERNATIONAL' UNION ALL
    SELECT 'FM', 'Micronesia, Federated States of', 'INTERNATIONAL' UNION ALL
    SELECT 'MD', 'Moldova, Republic of', 'INTERNATIONAL' UNION ALL
    SELECT 'MC', 'Monaco', 'INTERNATIONAL' UNION ALL
    SELECT 'MN', 'Mongolia', 'INTERNATIONAL' UNION ALL
    SELECT 'ME', 'Montenegro', 'INTERNATIONAL' UNION ALL
    SELECT 'MS', 'Montserrat, UK', 'INTERNATIONAL' UNION ALL
    SELECT 'MA', 'Morocco', 'INTERNATIONAL' UNION ALL
    SELECT 'MZ', 'Mozambique', 'INTERNATIONAL' UNION ALL
    SELECT 'MM', 'Myanmar', 'INTERNATIONAL' UNION ALL
    SELECT 'NA', 'Namibia', 'INTERNATIONAL' UNION ALL
    SELECT 'NR', 'Nauru', 'INTERNATIONAL' UNION ALL
    SELECT 'NL', 'Netherlands', 'EU' UNION ALL
    SELECT 'NZ', 'New Zealand', 'INTERNATIONAL' UNION ALL
    SELECT 'NI', 'Nicaragua', 'INTERNATIONAL' UNION ALL
    SELECT 'NE', 'Niger', 'INTERNATIONAL' UNION ALL
    SELECT 'NG', 'Nigeria', 'INTERNATIONAL' UNION ALL
    SELECT 'NU', 'Niue', 'INTERNATIONAL' UNION ALL
    SELECT 'NO', 'Norway', 'INTERNATIONAL' UNION ALL
    SELECT 'OM', 'Oman', 'INTERNATIONAL' UNION ALL
    SELECT 'PK', 'Pakistan', 'INTERNATIONAL' UNION ALL
    SELECT 'PW', 'Palau', 'INTERNATIONAL' UNION ALL
    SELECT 'PS', 'Palestine, State of', 'INTERNATIONAL' UNION ALL
    SELECT 'PA', 'Panama', 'INTERNATIONAL' UNION ALL
    SELECT 'PG', 'Papua New Guinea', 'INTERNATIONAL' UNION ALL
    SELECT 'PY', 'Paraguay', 'INTERNATIONAL' UNION ALL
    SELECT 'PE', 'Peru', 'INTERNATIONAL' UNION ALL
    SELECT 'PH', 'Philippines', 'INTERNATIONAL' UNION ALL
    SELECT 'PL', 'Poland', 'EU' UNION ALL
    SELECT 'PT', 'Portugal', 'EU' UNION ALL
    SELECT 'QA', 'Qatar', 'INTERNATIONAL' UNION ALL
    SELECT 'RO', 'Romania', 'EU' UNION ALL
    SELECT 'RU', 'Russian Federation', 'INTERNATIONAL' UNION ALL
    SELECT 'RW', 'Rwanda', 'INTERNATIONAL' UNION ALL
    SELECT 'BL', 'Saint Barthélemy', 'INTERNATIONAL' UNION ALL
    SELECT 'KN', 'Saint Kitts and Nevis', 'INTERNATIONAL' UNION ALL
    SELECT 'LC', 'Saint Lucia', 'INTERNATIONAL' UNION ALL
    SELECT 'PM', 'Saint Pierre and Miquelon', 'INTERNATIONAL' UNION ALL
    SELECT 'VC', 'Saint Vincent and the Grenadines', 'INTERNATIONAL' UNION ALL
    SELECT 'WS', 'Samoa', 'INTERNATIONAL' UNION ALL
    SELECT 'ST', 'Sao Tome and Principe', 'INTERNATIONAL' UNION ALL
    SELECT 'SA', 'Saudi Arabia', 'INTERNATIONAL' UNION ALL
    SELECT 'SN', 'Senegal', 'INTERNATIONAL' UNION ALL
    SELECT 'RS', 'Serbia', 'INTERNATIONAL' UNION ALL
    SELECT 'SC', 'Seychelles', 'INTERNATIONAL' UNION ALL
    SELECT 'SL', 'Sierra Leone', 'INTERNATIONAL' UNION ALL
    SELECT 'SG', 'Singapore', 'INTERNATIONAL' UNION ALL
    SELECT 'SK', 'Slovakia', 'EU' UNION ALL
    SELECT 'SI', 'Slovenia', 'EU' UNION ALL
    SELECT 'SB', 'Solomon Islands', 'INTERNATIONAL' UNION ALL
    SELECT 'SO', 'Somalia', 'INTERNATIONAL' UNION ALL
    SELECT 'ZA', 'South Africa', 'INTERNATIONAL' UNION ALL
    SELECT 'SS', 'South Sudan', 'INTERNATIONAL' UNION ALL
    SELECT 'ES', 'Spain', 'EU' UNION ALL
    SELECT 'LK', 'Sri Lanka', 'INTERNATIONAL' UNION ALL
    SELECT 'SX', 'St Maarten', 'INTERNATIONAL' UNION ALL
    SELECT 'SH', 'St. Helena, Ascension and Tristan Da Cunha, UK', 'INTERNATIONAL' UNION ALL
    SELECT 'SD', 'Sudan', 'INTERNATIONAL' UNION ALL
    SELECT 'SR', 'Suriname', 'INTERNATIONAL' UNION ALL
    SELECT 'SE', 'Sweden', 'EU' UNION ALL
    SELECT 'CH', 'Switzerland', 'INTERNATIONAL' UNION ALL
    SELECT 'SY', 'Syrian Arab Republic', 'INTERNATIONAL' UNION ALL
    SELECT 'TW', 'Taiwan, Province of China', 'INTERNATIONAL' UNION ALL
    SELECT 'TJ', 'Tajikistan', 'INTERNATIONAL' UNION ALL
    SELECT 'TZ', 'Tanzania, United Republic of', 'INTERNATIONAL' UNION ALL
    SELECT 'TH', 'Thailand', 'INTERNATIONAL' UNION ALL
    SELECT 'TL', 'Timor-Leste', 'INTERNATIONAL' UNION ALL
    SELECT 'TG', 'Togo', 'INTERNATIONAL' UNION ALL
    SELECT 'TO', 'Tonga', 'INTERNATIONAL' UNION ALL
    SELECT 'TT', 'Trinidad and Tobago', 'INTERNATIONAL' UNION ALL
    SELECT 'TN', 'Tunisia', 'INTERNATIONAL' UNION ALL
    SELECT 'TR', 'Turkey', 'INTERNATIONAL' UNION ALL
    SELECT 'TM', 'Turkmenistan', 'INTERNATIONAL' UNION ALL
    SELECT 'TC', 'Turks and Caicos Islands, UK', 'INTERNATIONAL' UNION ALL
    SELECT 'TV', 'Tuvalu', 'INTERNATIONAL' UNION ALL
    SELECT 'UG', 'Uganda', 'INTERNATIONAL' UNION ALL
    SELECT 'UA', 'Ukraine', 'INTERNATIONAL' UNION ALL
    SELECT 'AE', 'United Arab Emirates', 'INTERNATIONAL' UNION ALL
    SELECT 'GB', 'United Kingdom', 'GB' UNION ALL
    SELECT 'US', 'United States', 'INTERNATIONAL' UNION ALL
    SELECT 'UY', 'Uruguay', 'INTERNATIONAL' UNION ALL
    SELECT 'UZ', 'Uzbekistan', 'INTERNATIONAL' UNION ALL
    SELECT 'VU', 'Vanuatu', 'INTERNATIONAL' UNION ALL
    SELECT 'VE', 'Venezuela', 'INTERNATIONAL' UNION ALL
    SELECT 'VN', 'Vietnam', 'INTERNATIONAL' UNION ALL
    SELECT 'YE', 'Yemen', 'INTERNATIONAL' UNION ALL
    SELECT 'ZM', 'Zambia', 'INTERNATIONAL' UNION ALL
    SELECT 'ZW', 'Zimbabwe', 'INTERNATIONAL'
),
     allAERs as (SELECT account_id, aer.year reporting_year, aer.data aer_data FROM rpt_aer aer
                 UNION ALL
                 SELECT  CAST(rr.resource_id AS BIGINT) account_id, (rt.payload ->> 'reportingYear')::int reporting_year, rt.payload aer_data FROM request r JOIN request_type reqType on reqType.id = r.type_id
                                                                                                                                                             JOIN request_task rt on r.id = rt.request_id JOIN request_task_type rtt on rtt.id = rt.type_id JOIN request_resource rr on (r.id = rr.request_id AND rr.resource_type = 'ACCOUNT')
                 WHERE reqType.code = 'AER' AND rtt.code = 'AER_APPLICATION_REVIEW'
     ), sectionOperatorDetails
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
),voyages
AS (
SELECT account_id, reporting_year, "imoNumber" imoShip,
split_part("voyageDetails"->>'arrivalTime', 'T', 1) as arrival_date, replace(split_part("voyageDetails"->>'arrivalTime', 'T', 2), 'Z', '') as arrival_time,
split_part("voyageDetails"->>'departureTime', 'T', 1) as departure_date, replace(split_part("voyageDetails"->>'departureTime', 'T', 2), 'Z', '') as departure_time,
"voyageDetails"->'arrivalPort'->>'country' arrivalCountry, "voyageDetails"->'arrivalPort'->>'port' arrivalPort,"voyageDetails"->'departurePort'->>'country' departureCountry, "voyageDetails"->'departurePort'->>'port' departurePort,
"totalEmissions"->>'total' totalEmissions, "surrenderEmissions"->>'total' surrenderEmissions
FROM allAERs, jsonb_to_recordset(aer_data -> 'aer' -> 'voyageEmissions' -> 'voyages')
AS v("imoNumber" varchar, "voyageDetails" jsonb, "totalEmissions" jsonb, "surrenderEmissions" jsonb))
SELECT "Account Id", "Account name", "IMO", "Account status", "Reporting year" "Reporting Year",  "Reporting status", "EMP ID", o.legalStatus "Legal status",
       s.ship_name "Ship name", imoShip "Ship IMO Number",
       CASE
           WHEN (d.departurePort IN ('GBBEL', 'GBCLR', 'GBKLR', 'GBLAR', 'GBLDY', 'GBWPT')
               AND apt.port_type = 'GB') THEN 'Northern Ireland'
           WHEN (dpt.port_type = 'GB'
               AND d.arrivalPort IN ('GBBEL', 'GBCLR', 'GBKLR', 'GBLAR', 'GBLDY', 'GBWPT')) THEN 'Northern Ireland'
           WHEN (d.departurePort IN ('GBBEL', 'GBCLR', 'GBKLR', 'GBLAR', 'GBLDY', 'GBWPT')
               AND d.arrivalPort IN ('GBBEL', 'GBCLR', 'GBKLR', 'GBLAR', 'GBLDY', 'GBWPT')) THEN 'Domestic'
           WHEN dpt.port_type = 'INTERNATIONAL' AND apt.port_type = 'GB' THEN 'International'
           WHEN dpt.port_type = 'GB' AND apt.port_type = 'INTERNATIONAL' THEN 'International'
           WHEN dpt.port_type = 'EU' AND apt.port_type = 'GB' THEN 'EU'
           WHEN dpt.port_type = 'GB' AND apt.port_type = 'EU' THEN 'EU'
           WHEN dpt.port_type = 'GB' AND apt.port_type = 'GB' THEN 'Domestic'
           WHEN dpt.port_type = 'EU' AND apt.port_type = 'EU' THEN 'EU'
           WHEN dpt.port_type = 'INTERNATIONAL' AND apt.port_type = 'EU' THEN 'International'
           WHEN dpt.port_type = 'EU' AND apt.port_type = 'INTERNATIONAL' THEN 'International'
           WHEN dpt.port_type = 'INTERNATIONAL' AND apt.port_type = 'INTERNATIONAL' THEN 'International'
           ELSE 'Unknown' END AS "Journey Type",
       departureCountry "Country code of departure", departurePort "Port code of departure",
       departure_date "Date of departure", departure_time "Actual time of departure (ATD)", arrivalCountry "Country code of arrival", arrivalPort "Port code of arrival", arrival_date "Date of arrival", arrival_time "Actual time of arrival (ATA)",
       totalEmissions "Total emissions from voyage", surrenderEmissions "Emissions figure for surrender from voyage"
FROM sectionOperatorDetails o
         JOIN voyages d
              ON o.account_id = d.account_id AND o."Reporting year" = d.reporting_year
         LEFT JOIN port_countries dpt
                   ON d.departureCountry = dpt.country_code
         LEFT JOIN port_countries apt
                   ON d.arrivalCountry = apt.country_code
         JOIN ships s ON   s.account_id = d.account_id AND s.reporting_year = d.reporting_year AND s.imo_number = d.imoShip
-- Uncomment the line below for filtering by reporting year and IMO number
-- WHERE o."Reporting year" = 2024 AND o."IMO" = '0000001'
;