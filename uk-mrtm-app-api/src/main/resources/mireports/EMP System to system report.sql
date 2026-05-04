select
    distinct on (emp_stg.id)
    a.business_id                        "Account Id",
    a.name                               "Account name",
    am.imo_number                        "IMO",
    am.status                            "Status",
    emp_stg.provider_name                "Data supplier",
    emp_stg.updated_on::timestamp::date  "Date data received from data supplier",
    emp_stg.updated_on::timestamp::time  "Time data received from data supplier",
    emp_stg.imported_on::timestamp::date "Date data import was requested",
    emp_stg.imported_on::timestamp::time "Time data import was requested"
from emp_staging emp_stg
         join account a on emp_stg.account_id = a.id
         join account_mrtm am on am.id = a.id
         left join request_account r on r.account_id = a.id::VARCHAR
         left join request_task rt on rt.request_id = r.id
         left join request_task_type rtt on rtt.id = rt.type_id
where am.status = 'LIVE' or (rtt.code = 'EMP_ISSUANCE_APPLICATION_REVIEW');