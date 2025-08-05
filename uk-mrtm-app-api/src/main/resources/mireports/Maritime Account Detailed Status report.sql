select

       a.business_id                   "Account Id",

       a.name                          "Account name",

       am.imo_number                   "IMO",

       am.status                       "Account status",

       ars.status                      "Reporting status",

       am.first_maritime_activity_date "First maritime activity date",

       p.id                            "EMP ID",

       am.registry_id                  "UK ETS Registry Id",

       am.created_date                 "Created date",

       am.created_by                   "Created by$userfullname",

       am.last_updated_date            "Last updated date",

       am.last_updated_by              "Last updated by$userfullname",

       closing_date                    "Closing date",

       closed_by as                    "Closed by$userfullname"

from account a

         join account_mrtm am on am.id = a.id

         left join emp p on p.account_id = a.id

         left join account_reporting_status ars on a.id = ars.account_id
         where (ars.account_id, ars.year) IN (
                select account_id, MAX(year)
                from account_reporting_status
                group by account_id
);