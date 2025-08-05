/* AER Report information (Maritime) */
with parameters as (
    select null::integer as reportingYear,  -- Set value (e.g. 2020) or keep null for all years
           null::text    as imoNumber       -- Set value (e.g. '3062025') or keep null for all IMO
),
accounts_of_interest as (
    select a.id, a.business_id, a.name, am.status, am.imo_number
      from account a
      join account_mrtm am on am.id = a.id
     where (select imoNumber from parameters) is null or am.imo_number = (select imoNumber from parameters)
),
aers_all_years as (
    select CAST(rr.resource_id AS BIGINT) account_id, r.id request_id, r.status,
           cast(r.metadata ->> 'year' as integer) reporting_year
      from request r
      join request_type rt on rt.id = r.type_id
      join request_resource rr on (r.id = rr.request_id AND rr.resource_type = 'ACCOUNT')
     where rt.code = 'AER'
       and ((select reportingYear from parameters) is null or cast(r.metadata ->> 'year' as integer) = (select reportingYear from parameters))
),
aer_reviewed_or_completed as (
    select r.*
      from aers_all_years r
     where r.status = 'COMPLETED'
        or (r.status = 'IN_PROGRESS' and exists (
            select 1 from request_task rt
            join request_task_type rtt on rtt.id = rt.type_id
           where rt.request_id = r.request_id and rtt.code = 'AER_APPLICATION_REVIEW'
        ))
),
aer_submissions as (
    select r.account_id, r.request_id, r.status, r.reporting_year,
           ra.payload action_payload,
           ra.creation_date action_creation_date,
           min(ra.creation_date) over (partition by ra.request_id) min_action_creation_date,
           max(ra.creation_date) over (partition by ra.request_id) max_action_creation_date
      from aer_reviewed_or_completed r
      join request_action ra on ra.request_id = r.request_id
     where ra.type in ('AER_APPLICATION_SUBMITTED','AER_APPLICATION_AMENDS_SUBMITTED')
),
latest_aer_submission as (
    select account_id, request_id, status aer_status, reporting_year, action_creation_date aer_submission_date,
           action_payload ->> 'verificationPerformed' verification_performed,
           action_payload ->> 'reportingRequired' report_required,
           cast(action_payload -> 'aer' -> 'totalEmissions'   ->> 'totalShipEmissions'     as double precision) total_report_emissions,
           cast(action_payload -> 'aer' -> 'totalEmissions'   ->> 'surrenderEmissions'     as double precision) total_surrender_emissions,
           cast(action_payload -> 'aer' -> 'smf' -> 'smfDetails' ->> 'totalSustainableEmissions' as double precision) emissionsReductionClaim,
           action_payload -> 'verificationReport' -> 'verificationBodyDetails' ->> 'name' verificationBodyName,
           case action_payload -> 'verificationReport' -> 'overallDecision' ->> 'type'
                when 'VERIFIED_AS_SATISFACTORY'               then 'Verified as Satisfactory'
                when 'VERIFIED_AS_SATISFACTORY_WITH_COMMENTS' then 'Verified as Satisfactory with comments'
                when 'NOT_VERIFIED'                           then 'Not Verified'
                else action_payload -> 'verificationReport' -> 'overallDecision' ->> 'type'
           end overallDecision,
           action_payload -> 'verificationReport' -> 'opinionStatement' ->> 'emissionsCorrect' emissionsCorrect,
           cast(action_payload -> 'verificationReport' -> 'opinionStatement' ->> 'manuallyProvidedEmissions' as double precision) verifierProvidedEmissions,
           cast(action_payload -> 'verificationReport' -> 'opinionStatement' ->> 'manuallyProvidedSurrenderEmissions' as double precision) verifierSurrenderProvidedEmissions
      from aer_submissions
     where action_creation_date = max_action_creation_date
),
earliest_aer_submission as (
    select account_id, request_id, reporting_year, action_creation_date aer_submission_date
      from aer_submissions
     where action_creation_date = min_action_creation_date
),
doe_emissions as (
    select re.account_id, re.year reporting_year,
           cast(re.total_emissions as double precision) doe_emissions,
           cast(re.surrender_emissions as double precision) doe_surrender_emissions
      from rpt_reportable_emissions re
     where re.is_from_doe
       and ((select reportingYear from parameters) is null or re.year = (select reportingYear from parameters))
),
account_years as (
    select distinct r.account_id, r.reporting_year
      from aers_all_years r
     left join aer_reviewed_or_completed arc on arc.account_id = r.account_id and arc.reporting_year = r.reporting_year
     left join doe_emissions d on d.account_id = r.account_id and d.reporting_year = r.reporting_year
     where arc.account_id is not null or d.account_id is not null
)
select
       a.business_id                         "Account Id",
       a.name                                "Account name",
       a.imo_number                          "IMO",
       a.status                              "Account status",
       p.id                                  "EMP Id",
       ay.reporting_year                     "Reporting Year",
       ars.status                            "Reporting status",
       case op.report_required when 'true' then 'Yes' when 'false' then 'No' end "Is Report required",
       to_char(erl.aer_submission_date, 'YYYY-MM-DD') "Date of first submission",
       to_char(op.aer_submission_date , 'YYYY-MM-DD') "Date of last submission",
       case op.verification_performed when 'true' then 'Yes' when 'false' then 'No' end "Verification Carried Out",
       op.verificationBodyName               "Verifier",
       op.overallDecision                    "Verifier Opinion",
       case when op.verification_performed = 'true'
             then case when op.emissionsCorrect = 'true' then 'Yes' else 'No' end
       end                                   "Are reported emissions correct?",
       case when op.verification_performed = 'true'
             then case when op.emissionsCorrect = 'true' then op.total_report_emissions else op.verifierProvidedEmissions end
       end                                   "Total verified maritime emissions",
       case when op.verification_performed = 'true'
             then case when op.emissionsCorrect = 'true' then op.total_surrender_emissions else op.verifierSurrenderProvidedEmissions end
       end                                   "Verified Emissions figure for surrender",
       d.doe_emissions                       "Total emissions from DoE",
       d.doe_surrender_emissions             "Emissions figure for surrender DoE",
       op.total_report_emissions             "Total reported emissions",
       op.total_surrender_emissions          "Emissions figure for surrender",
       op.emissionsReductionClaim            "Emissions reduction claim"
  from account_years ay
  join accounts_of_interest a on a.id = ay.account_id
  left join emp p on p.account_id = a.id
  left join latest_aer_submission op on op.account_id = ay.account_id and op.reporting_year = ay.reporting_year
  left join earliest_aer_submission erl on erl.account_id = ay.account_id and erl.reporting_year = ay.reporting_year
  left join doe_emissions d on d.account_id = ay.account_id and d.reporting_year = ay.reporting_year
  left join account_reporting_status ars on ars.account_id = ay.account_id and ars.year = ay.reporting_year
 order by "Account Id", "Reporting Year";