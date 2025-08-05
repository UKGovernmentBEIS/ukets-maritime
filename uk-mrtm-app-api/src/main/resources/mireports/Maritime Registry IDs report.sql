/* Registry IDs */

  select  a.business_id                        "Account ID",
          a.name                               "Account name",
          am.status                            "Account status",
          am.imo_number                        "IMO",
          p.id                                 "EMP ID",
          am.registry_id                       "UK ETS Registry ID"
     from account a
     join account_mrtm am on am.id = a.id
left join emp p on p.account_id = a.id
;