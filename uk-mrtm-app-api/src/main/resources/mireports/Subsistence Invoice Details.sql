select 

       a.business_id              "Account Id",

       a.name                     "Account name",

       am.imo_number              "IMO",

       am.status                  "Account status",

       ars.status                 "Reporting status",

       am.sop_id                  "SOP ID",  

       acp.user_id                "Primary contact name$userfullname",
       acp.user_id                "Primary contact email$useremail",
       acf.user_id                "Finance contact name$userfullname",
       acf.user_id                "Finance contact email$useremail"

from account a

         join account_mrtm am on am.id = a.id

         join emp p on p.account_id = a.id

         left join account_contact acp on acp.account_id = a.id and acp.contact_type = 'PRIMARY'

         left join account_contact acf on acf.account_id = a.id and acf.contact_type = 'FINANCIAL'

         left join account_reporting_status ars on a.id = ars.account_id
         where (ars.account_id, ars.year) IN (
                select account_id, MAX(year)
                from account_reporting_status
                group by account_id)


order by a.business_id;
