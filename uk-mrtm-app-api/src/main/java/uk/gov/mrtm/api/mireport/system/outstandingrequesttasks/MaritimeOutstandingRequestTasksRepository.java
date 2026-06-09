package uk.gov.mrtm.api.mireport.system.outstandingrequesttasks;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.hibernate.query.NativeQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.netz.api.mireport.system.outstandingrequesttasks.OutstandingRegulatorRequestTasksMiReportParams;
import uk.gov.netz.api.mireport.system.outstandingrequesttasks.OutstandingRequestTasksRepository;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class MaritimeOutstandingRequestTasksRepository implements OutstandingRequestTasksRepository {

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<MaritimeOutstandingRequestTask> findOutstandingRequestTaskParams(EntityManager entityManager,
                                                                                 OutstandingRegulatorRequestTasksMiReportParams params) {

        String usersPredicate = !params.getUserIds().isEmpty() ? "and req_task.assignee in (:userIds)" : " ";
        Query query = entityManager.createNativeQuery("""
            select
                a.business_id as "accountId",
                a.name as "accountName",
                req.id as "requestId",
                req_type.code as "requestType",
                req_task_type.code as "requestTaskType",
                req_task.assignee as "requestTaskAssignee",
                req_task.due_date as "requestTaskDueDate",
                req_task.pause_date as "requestTaskPausedDate",
                am.imo_number as "imoNumber",
                am.status as "accountStatus"
            from request_account req
                    join request_type req_type on req_type.id = req.type_id
                    join request_task req_task on req.id = req_task.request_id
                    join request_task_type req_task_type on req_task_type.id = req_task.type_id
                    join account_mrtm am on am.id = CAST(req.account_id AS bigint)
                    join account a on am.id = a.id
            where
                req_task_type.code in (:requestTaskTypes)
            """
            + usersPredicate +
            """
              order by am.id asc, req_type.code asc, req.id asc, req_task.start_date asc
            """);

        if (!params.getUserIds().isEmpty()) {
            query.setParameter("userIds", params.getUserIds());
        }
        List resultList = query
            .unwrap(NativeQuery.class)
            .setParameter("requestTaskTypes", params.getRequestTaskTypes())
            .addScalar("accountId", StandardBasicTypes.STRING)
            .addScalar("accountName", StandardBasicTypes.STRING)
            .addScalar("requestId", StandardBasicTypes.STRING)
            .addScalar("requestType", StandardBasicTypes.STRING)
            .addScalar("requestTaskType", StandardBasicTypes.STRING)
            .addScalar("requestTaskAssignee", StandardBasicTypes.STRING)
            .addScalar("requestTaskDueDate", StandardBasicTypes.LOCAL_DATE)
            .addScalar("requestTaskPausedDate", StandardBasicTypes.LOCAL_DATE)
            .addScalar("imoNumber", StandardBasicTypes.STRING)
            .addScalar("accountStatus", StandardBasicTypes.STRING)
            .setReadOnly(true)
            .setTupleTransformer((tuple, aliases) -> {
                Map<String, Object> map = new HashMap<>();
                for (int i = 0; i < tuple.length; i++) {
                    map.put(aliases[i], tuple[i]);
                }
                return new MaritimeOutstandingRequestTask((String) map.get("accountId"),
                    (String) map.get("accountName"),
                    (String) map.get("requestId"),
                    (String) map.get("requestType"),
                    (String) map.get("requestTaskType"),
                    (String) map.get("requestTaskAssignee"),
                    (LocalDate) map.get("requestTaskDueDate"),
                    (LocalDate) map.get("requestTaskPausedDate"),
                    (String) map.get("imoNumber"),
                    (String) map.get("accountStatus"));
            })
            .getResultList();

        return resultList;
    }
}
