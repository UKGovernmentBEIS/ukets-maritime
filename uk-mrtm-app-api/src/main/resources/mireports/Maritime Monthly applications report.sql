with

  months as (select m from generate_series(1, 12) m)

, years as (select y from generate_series(2023, cast(extract(year from now()) as numeric)) y)

, year_months as (

      select y submissionYear, m submissionMonth

        from years, months

       where y < cast(extract(year from now()) as numeric)

          or y = cast(extract(year from now()) as numeric) and m <= cast(extract(month from now()) as numeric)

)

, requests as (

    select cast(extract (year from r.submission_date) as numeric) submissionYear, cast(extract (month from r.submission_date) as numeric) submissionMonth, r.submission_date, rt.code type, r.metadata

      from request r

      join request_resource rr on r.id = rr.request_id

      join account_mrtm am on (rr.resource_type = 'ACCOUNT' and  am.id = CAST(rr.resource_id AS bigint))

      join request_type rt on r.type_id = rt.id

     where rt.code <> 'SYSTEM_MESSAGE_NOTIFICATION'

       and r.submission_date is not null

)

, accountClosures as (

    select submissionYear, submissionMonth, count(*) countOfRequests

      from requests

     where type = 'ACCOUNT_CLOSURE'

     group by submissionYear, submissionMonth

)

, EmpApplications as (

    select submissionYear, submissionMonth, count(*) countOfRequests

      from requests

     where type = 'EMP_ISSUANCE'

     group by submissionYear, submissionMonth

)

, EmpVariations as (

    select submissionYear, submissionMonth, count(*) countOfRequests

      from requests

     where type = 'EMP_VARIATION' and coalesce(metadata ->> 'initiatorRoleType', '') <> 'REGULATOR'

     group by submissionYear, submissionMonth

)

, EmpRegulatorVariations as (

    select submissionYear, submissionMonth, count(*) countOfRequests

      from requests

     where type = 'EMP_VARIATION' and coalesce(metadata ->> 'initiatorRoleType', '') = 'REGULATOR'

     group by submissionYear, submissionMonth

)
, annualEmissionReports as (
    select submissionYear, submissionMonth, count(*) countOfRequests
      from requests
     where type = 'AVIATION_AER_UKETS'
     group by submissionYear, submissionMonth
)
, reportableEmissionsDeterminations as (
    select submissionYear, submissionMonth, count(*) countOfRequests
      from requests
     where type = 'DOE'
     group by submissionYear, submissionMonth
)
, verifierImprovementReports as (
    select submissionYear, submissionMonth, count(*) countOfRequests
      from requests
     where type = 'AVIATION_VIR_UKETS'
     group by submissionYear, submissionMonth
)
, nonCompliances as (
    select submissionYear, submissionMonth, count(*) countOfRequests
      from requests
     where type = 'NON_COMPLIANCE'
     group by submissionYear, submissionMonth
)
select ym.submissionYear as "Submission Year", ym.submissionMonth as "Submission Month",

       coalesce(r1 .countOfRequests, 0) "Account Closure",

       coalesce(r3 .countOfRequests, 0) "EMP Applications",

       coalesce(r4 .countOfRequests, 0) "EMP Variations",

       coalesce(r5 .countOfRequests, 0) "EMP Regulator Variations",
       coalesce(r6 .countOfRequests, 0) "Annual Emissions Report",
       coalesce(r7 .countOfRequests, 0) "Reportable Emissions Report",
       coalesce(r8 .countOfRequests, 0) "Verifier Improvements Report",
       coalesce(r9 .countOfRequests, 0) "Non compliances"

  from year_months ym

  left join accountClosures                        r1  on r1 .submissionYear = ym.submissionYear and r1 .submissionMonth = ym.submissionMonth

  left join EmpApplications                   r3  on r3 .submissionYear = ym.submissionYear and r3 .submissionMonth = ym.submissionMonth

  left join EmpVariations                     r4  on r4 .submissionYear = ym.submissionYear and r4 .submissionMonth = ym.submissionMonth

  left join EmpRegulatorVariations            r5  on r5 .submissionYear = ym.submissionYear and r5 .submissionMonth = ym.submissionMonth
  left join annualEmissionReports             r6  on r6 .submissionYear = ym.submissionYear and r6 .submissionMonth = ym.submissionMonth
  left join reportableEmissionsDeterminations     r7  on r7.submissionYear = ym.submissionYear and r7.submissionMonth = ym.submissionMonth
  left join verifierImprovementReports            r8  on r8 .submissionYear = ym.submissionYear and r8 .submissionMonth = ym.submissionMonth
  left join nonCompliances            r9  on r9 .submissionYear = ym.submissionYear and r9 .submissionMonth = ym.submissionMonth

order by 1, 2;