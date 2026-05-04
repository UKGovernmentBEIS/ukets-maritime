select
    distinct on (aer_stg.id)
    a.business_id                        "Account Id",
    a.name                               "Account name",
    am.imo_number                        "IMO",
    aer_stg.year                         "Reporting Year",
    am.status                            "Status",
    aer_stg.provider_name                "Data supplier",
    aer_stg.updated_on::timestamp::date  "Date data received from data supplier",
    aer_stg.updated_on::timestamp::time  "Time data received from data supplier",
    aer_stg.imported_on::timestamp::date "Date data import was requested",
    aer_stg.imported_on::timestamp::time "Time data import was requested"
from aer_staging aer_stg
         join account a on aer_stg.account_id = a.id
         join account_mrtm am on am.id = a.id
         left join request_account r on r.account_id = a.id::VARCHAR
         left join request_task rt on rt.request_id = r.id
         left join request_task_type rtt on rtt.id = rt.type_id
where r.status = 'COMPLETED' or (rtt.code = 'AER_APPLICATION_REVIEW') ;