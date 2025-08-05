with r1 as (
    /* Collect details from the Non-Compliance submitted timeline event */
    select r.id,
           ra.creation_date                   Non_Compliance_submit_date,
           ra.payload ->> 'reason'            Reason_for_Non_Compliance,
           ra.payload ->> 'nonComplianceDate' Date_became_Non_compliant,
           ra.payload ->> 'complianceDate'    Date_became_Compliant,
           case ra.payload ->> 'initialPenalty' when 'true' then 'Yes' else 'No' end Liable_for_Initial_Penalty,
           case ra.payload ->> 'noticeOfIntent' when 'true' then 'Yes' else 'No' end Will_issue_Notice_Of_Intent,
           case ra.payload ->> 'civilPenalty'   when 'true' then 'Yes' else 'No' end Will_pursue_a_Civil_Penalty
      from request r join request_action ra on ra.request_id = r.id
      join request_type rt on rt.id = r.type_id
     where rt.code = 'NON_COMPLIANCE' and ra.type = 'NON_COMPLIANCE_APPLICATION_SUBMITTED'
), r2 as (
    /* Collect details from the Initial penalty Notice timeline event */
    select r.id,
           ra.creation_date Initial_Penalty_Issue_date
      from request r join request_action ra on ra.request_id = r.id
      join request_type rt on rt.id = r.type_id
     where rt.code = 'NON_COMPLIANCE' and ra.type = 'NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_APPLICATION_SUBMITTED'
), r3 as (
    /* Collect details from the Notice of intent timeline event */
    select r.id,
           ra.creation_date Notice_Of_Intent_date
      from request r join request_action ra on ra.request_id = r.id
      join request_type rt on rt.id = r.type_id
     where rt.code = 'NON_COMPLIANCE' and ra.type = 'NON_COMPLIANCE_NOTICE_OF_INTENT_APPLICATION_SUBMITTED'
), r4 as (
    /* Collect details from the Civil penalty timeline event */
    select r.id,
           ra.creation_date               Penalty_Issue_date,
           ra.payload ->> 'penaltyAmount' Penalty_amount,
           ra.payload ->> 'dueDate'       Penalty_payment_Due_date
      from request r join request_action ra on ra.request_id = r.id
      join request_type rt on rt.id = r.type_id
     where rt.code = 'NON_COMPLIANCE' and ra.type = 'NON_COMPLIANCE_CIVIL_PENALTY_APPLICATION_SUBMITTED'
), r5 as (
    /* Collect details from the Final determination submitted timeline event */
    select r.id,
           ra.creation_date                        Completion_date,
           ra.payload ->> 'operatorPaidDate'       Date_paid,
           ra.payload ->> 'complianceRestoredDate' Date_Compliance_Restored
      from request r join request_action ra on ra.request_id = r.id
      join request_type rt on rt.id = r.type_id
     where rt.code = 'NON_COMPLIANCE' and ra.type = 'NON_COMPLIANCE_FINAL_DETERMINATION_APPLICATION_SUBMITTED'
)
   select a.business_id                      "Account ID",
          p.id                               "EMP ID",
          a.name                             "Account name",
          am.status                          "Account status",
          am.imo_number                      "IMO",
          r.id                               "Workflow ID",
          date_part('year', r.creation_date) "Non compliance Year",
          r.status                           "Workflow status",
          Non_Compliance_submit_date         "Non compliance Submit Date",
          Reason_for_Non_Compliance          "Reason for Non Compliance",
          Date_became_Non_compliant          "Date became non compliant",
          Date_became_Compliant              "Date became compliant",
          Liable_for_Initial_Penalty         "Liable for Initial penalty",
          Will_issue_Notice_Of_Intent        "Issue a notice of intent",
          Will_pursue_a_Civil_Penalty        "Liable for civil penalty",
          Initial_Penalty_Issue_date         "Notify - Initial penalty",
          Notice_Of_Intent_date              "Notify - NOI",
          Penalty_Issue_date                 "Notify - Civil penalty",
          Penalty_amount                     "Civil penalty amount",
          Penalty_payment_Due_date           "Civil payment due date",
          Completion_date                    "Non compliance conclusion date",
          Date_paid                          "Date of payment",
          Date_Compliance_Restored           "Date compliance restored"
     from account              a
left join account_mrtm         am on am.id = a.id
left join emp                  p on p.account_id = a.id
join request_resource rr on (rr.resource_type = 'ACCOUNT' and am.id =CAST(rr.resource_id AS bigint))
join request r on r.id = rr.request_id
join request_type rt on r.type_id = rt.id
left join r1 on r1.id = r.id
left join r2 on r2.id = r.id
left join r3 on r3.id = r.id
left join r4 on r4.id = r.id
left join r5 on r5.id = r.id
where rt.code = 'NON_COMPLIANCE'
 order by "Account ID", "Workflow ID"