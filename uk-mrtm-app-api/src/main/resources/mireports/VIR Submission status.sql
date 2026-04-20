/* 2025-03-14, JF: To amend the year for which data are retrieved, change the penultimate line. */
with vir as (
    select r.id request_id, r.status, r.creation_date, r.submission_date, cast(r.metadata ->> 'year' as integer) reporting_year
      from request r
      join request_type rt on r.type_id = rt.id
     where rt.code = 'VIR'
), submitTask as (
    select rt.request_id, rt.due_date
      from request_task rt
      join request_task_type rtt on rtt.id = rt.type_id
     where rtt.code = 'VIR_APPLICATION_SUBMIT'
), reviewTask as (
    select rt.request_id, rt.due_date, rt.assignee
      from request_task rt
      join request_task_type rtt on rtt.id = rt.type_id
     where rtt.code = 'VIR_APPLICATION_REVIEW'
), reviewSubmittedEvent as (
    select ra.request_id, ra.creation_date determination_date, ra.submitter_id determined_by
      from request_action ra
     where ra.type = 'VIR_APPLICATION_REVIEWED'
), responseTask as (
    select rt.request_id, key outstanding_improvement, case when to_date(value ->> 'improvementDeadline', 'YYYY-MM-DD') < current_date then 1 end is_overdue
      from request_task rt join request_task_type rtt on rtt.id = rt.type_id, jsonb_each(rt.payload -> 'regulatorImprovementResponses')
     where rtt.code = 'VIR_RESPOND_TO_REGULATOR_COMMENTS'
), stats as (
    select request_id, count(outstanding_improvement) count_of_outstanding_improvements, count(is_overdue) count_of_overdue_improvements
      from responseTask t
     group by request_id
)
select
       a.id             "Account ID",
       p.id             "EMP ID",
       a.name           "Account name",
       am.status        "Account status",
       am.imo_number    "IMO",
       r.reporting_year "Reporting year",
       ars.status       "Reporting status",
       ac.user_id       "Primary contact name$userfullname",
       ac.user_id       "Primary contact email$useremail",
       r.request_id     "Workflow ID",
       r.status         "Workflow status",
       r.creation_date  "VIR creation date",
       st.due_date      "VIR submission due date",
       r.submission_date "VIR submission date",
       rt.assignee      "Determination assigned$userfullname",
       re.determination_date   "Determination date",
       re.determined_by "Determined by$userfullname",
       s.count_of_outstanding_improvements "No of outstanding improvements",
       s.count_of_overdue_improvements "No of overdue improvements"
  from account a
  join account_mrtm am on am.id = a.id
  join emp p on p.account_id = a.id
  left join account_reporting_status ars on a.id = ars.account_id
  left join account_contact ac on ac.account_id = a.id and ac.contact_type = 'PRIMARY'
  join request_resource rr on (rr.resource_type = 'ACCOUNT' and rr.resource_id = a.id::VARCHAR)
  join vir r on rr.request_id = r.request_id
  left join submitTask st on st.request_id = r.request_id
  left join reviewTask rt on rt.request_id = r.request_id
  left join reviewSubmittedEvent re on re.request_id = r.request_id
  left join stats s on s.request_id = r.request_id
 -- To get data for all years, remove the following line.
 where extract('Year' from r.creation_date) = 2025
 and (ars.year = r.reporting_year)
 order by a.id