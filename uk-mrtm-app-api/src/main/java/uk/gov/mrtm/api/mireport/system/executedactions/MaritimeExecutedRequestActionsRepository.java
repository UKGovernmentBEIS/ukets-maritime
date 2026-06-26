package uk.gov.mrtm.api.mireport.system.executedactions;

import jakarta.persistence.EntityManager;
import org.hibernate.query.NativeQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.netz.api.mireport.system.executedactions.ExecutedRequestActionsMiReportParams;
import uk.gov.netz.api.mireport.system.executedactions.ExecutedRequestActionsRepository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class MaritimeExecutedRequestActionsRepository implements ExecutedRequestActionsRepository {

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<MaritimeExecutedRequestAction> findExecutedRequestActions(EntityManager entityManager, ExecutedRequestActionsMiReportParams reportParams) {
        return entityManager.createNativeQuery("""
                select
                    a.business_id as "accountId",
                    a.name as "accountName",
                    am.status as "accountStatus",
                    r.id as "requestId",
                    rt.code as "requestType",
                    r.status as "requestStatus",
                    ra.type as "requestActionType",
                    ra.submitter as "requestActionSubmitter",
                    ra.creation_date as "requestActionCompletionDate",
                    am.imo_number as "imoNumber",
                    p.id as "empId"
                from request_account r
                        join request_type rt on rt.id = r.type_id
                        join request_action ra on ra.request_id = r.id
                        join account_mrtm am on am.id = CAST(r.account_id AS bigint)
                        join account a on am.id = a.id
                        left join emp p on p.account_id = a.id
                where
                    ra.creation_date >= :fromDate
                    and (
                        cast(:toDate as timestamp) is null
                        or ra.creation_date <= cast(:toDate as timestamp)
                    )

                order by am.id asc, rt.code asc, r.id asc, ra.creation_date asc
                """)
            .unwrap(NativeQuery.class)
            .setParameter("fromDate", reportParams.getFromDate())
            .setParameter("toDate", reportParams.getToDate() == null ? null : LocalDateTime.of(reportParams.getToDate(), LocalTime.MAX))
            .addScalar("accountId", StandardBasicTypes.STRING)
            .addScalar("accountName", StandardBasicTypes.STRING)
            .addScalar("accountStatus", StandardBasicTypes.STRING)
            .addScalar("requestId", StandardBasicTypes.STRING)
            .addScalar("requestType", StandardBasicTypes.STRING)
            .addScalar("requestStatus", StandardBasicTypes.STRING)
            .addScalar("requestActionType", StandardBasicTypes.STRING)
            .addScalar("requestActionSubmitter", StandardBasicTypes.STRING)
            .addScalar("requestActionCompletionDate", StandardBasicTypes.LOCAL_DATE_TIME)
            .addScalar("imoNumber", StandardBasicTypes.STRING)
            .addScalar("empId", StandardBasicTypes.STRING)
            .setReadOnly(true)
            .setTupleTransformer((tuple, aliases) -> {
                Map<String, Object> map = new HashMap<>();
                for(int i = 0; i < tuple.length; i++) {
                    map.put(aliases[i], tuple[i]);
                }
                MaritimeExecutedRequestAction result = new MaritimeExecutedRequestAction();
                result.setAccountId((String)map.get("accountId"));
                result.setAccountName((String)map.get("accountName"));
                result.setAccountStatus((String)map.get("accountStatus"));
                result.setRequestId((String)map.get("requestId"));
                result.setRequestType((String)map.get("requestType"));
                result.setRequestStatus((String)map.get("requestStatus"));
                result.setRequestActionType((String)map.get("requestActionType"));
                result.setRequestActionSubmitter((String)map.get("requestActionSubmitter"));
                result.setRequestActionCompletionDate((LocalDateTime)map.get("requestActionCompletionDate"));
                result.setImoNumber((String)map.get("imoNumber"));
                result.setEmpId((String)map.get("empId"));
                return result;
            })
            .getResultList();
    }
}
