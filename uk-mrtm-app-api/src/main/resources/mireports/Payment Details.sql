with r1 as (
    select rt.request_id,
           rt.payload ->> 'paymentRefNum' payment_Ref_Num,
           rt.payload ->> 'amount'        amount,
           rt.payload ->> 'creationDate'  creation_Date
      from request_task rt
      join request_task_type rtt on rtt.id = rt.type_id
     where rtt.code like '%_MAKE_PAYMENT'
), r2 as (
    select ra.request_id,
           ra.payload ->> 'paymentRefNum'       payment_Ref_Num,
           ra.payload ->> 'amount'              amount,
           ra.payload ->> 'paymentCreationDate' creation_Date,
           ra.payload ->> 'paymentDate'         payment_Date,
           ra.payload ->> 'paymentMethod'       payment_Method
      from request_action ra
     where ra.type = 'PAYMENT_MARKED_AS_PAID' or ra.type = 'PAYMENT_COMPLETED'
), r3 as (
    select ra.request_id,
           ra.payload ->> 'paymentRefNum'       payment_Ref_Num,
           ra.payload ->> 'amount'              amount,
           ra.payload ->> 'paymentCreationDate' creation_Date,
           ra.payload ->> 'paymentDate'         payment_Date,
           ra.payload ->> 'paymentMethod'       payment_Method,
           ra.payload ->> 'receivedDate'        received_Date,
           case when ra.type = 'PAYMENT_CANCELLED' then ra.creation_date::text end cancelled_Date
      from request_action ra
     where ra.type = 'PAYMENT_MARKED_AS_RECEIVED' or ra.type = 'PAYMENT_CANCELLED'
), r4 as (
    select coalesce(r3.request_id     , r2.request_id     , r1.request_id     ) request_id,
           coalesce(r3.payment_Ref_Num, r2.payment_Ref_Num, r1.payment_Ref_Num) payment_Ref_Num,
           coalesce(r3.amount         , r2.amount         , r1.amount         ) amount,
           coalesce(r3.creation_Date  , r2.creation_Date  , r1.creation_Date  ) creation_Date,
           coalesce(r3.payment_Date   , r2.payment_Date  ) payment_Date,
           coalesce(r3.payment_Method , r2.payment_Method) payment_Method,
           r3.received_Date,
           r3.cancelled_Date
      from r1
      full join r2 on r2.request_id = r1.request_id
      full join r3 on r3.request_id = r2.request_id
)
   select
          am.emission_trading_scheme            "Emission Trading Scheme",
          a.business_id                         "Account Id",
          a.name                                "Account name",
          am.imo_number                         "IMO",
          am.status                            "Account status",
          extract('Year' from to_date(coalesce(r4.creation_date, r4.payment_Date, r4.cancelled_Date), 'YYYY-MM-DD')) as "Reporting year",
          ars.status                           "Reporting status",
          t.code                               "Workflow Type",
          r4.payment_Ref_Num                   "Payment Reference Number",
          r4.amount                            "Payment amount",
          r4.creation_Date                     "Creation Date",
          r4.payment_Date                      "Payment Date",
          r4.payment_Method                    "Payment Method",
          r4.received_Date                     "Received Date",
          r4.cancelled_Date                    "Cancelled Date"
     from account              a
     join account_mrtm am on am.id = a.id
     join request_resource rr on (rr.resource_type = 'ACCOUNT' and rr.resource_id = a.id::VARCHAR)
     join request              r  on rr.request_id = r.id
     join r4                      on r4.request_id = r.id
    left join account_reporting_status ars on a.id = ars.account_id
    left join request_type t on r.type_id = t.id
    where (ars.year = extract('Year' from to_date(coalesce(r4.creation_date, r4.payment_Date, r4.cancelled_Date), 'YYYY-MM-DD')))
 order by coalesce(r4.creation_Date, r4.payment_Date, r4.cancelled_Date) desc