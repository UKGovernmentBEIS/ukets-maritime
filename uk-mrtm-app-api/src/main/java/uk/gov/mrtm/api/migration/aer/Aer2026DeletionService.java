package uk.gov.mrtm.api.migration.aer;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.flowable.common.engine.api.FlowableObjectNotFoundException;
import org.springframework.boot.actuate.autoconfigure.endpoint.condition.ConditionalOnAvailableEndpoint;
import org.springframework.boot.actuate.endpoint.annotation.DeleteOperation;
import org.springframework.boot.actuate.endpoint.web.annotation.WebEndpoint;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@WebEndpoint(id = "aer-2026-delete")
@ConditionalOnAvailableEndpoint(endpoint = Aer2026DeletionService.class)
@RequiredArgsConstructor
@Log4j2
public class Aer2026DeletionService {
    private static final String DELETE_REASON = "AER 2026 deleted by the system";
    private static final int YEAR = 2026;

    @PersistenceContext
    private EntityManager entityManager;

    private final WorkflowService workflowService;

    @DeleteOperation
    @Transactional
    public List<String> delete2026Aer() {
        log.info("START aer-2026-delete MIGRATION SERVICE!");

        log.info("Fetching eligible requests...");
        List<Request> requests = findByRequestTypeAndMetadataYear();
        Set<Long> accountIds = requests.stream().map(Request::getAccountId).collect(Collectors.toSet());
        List<String> requestIds = requests.stream().map(Request::getId).collect(Collectors.toList());
        log.info("Eligible requests with ids: {} and account ids: {}", requestIds, accountIds);

        for (Request request : requests) {
            deleteProcessInstance(request);
            deleteReportingStatusHistoryByAccountId(request.getAccountId());
            deleteReportingStatusByAccountId(request.getAccountId());
            deleteRequestActionsByRequestId(request.getId());
            deleteRequestResourcesByRequestId(request.getId());
            deleteRequestTaskHistoryByRequestId(request.getId());
            deleteRequestTaskByRequestId(request.getId());
            deleteRequestById(request.getId());
        }

        log.info("END aer-2026-delete MIGRATION SERVICE!");
        return requestIds;
    }

    private List<Request> findByRequestTypeAndMetadataYear() {
        return (List<Request>) entityManager.createNativeQuery("SELECT r.* FROM request r "
                + "JOIN request_type rt ON r.type_id = rt.id "
                + "WHERE rt.code = :requestType "
                + "AND cast(r.metadata->>'year' as INTEGER) = :year", Request.class)
            .setParameter("requestType", MrtmRequestType.AER)
            .setParameter("year", YEAR)
            .getResultList();
    }

    private void deleteProcessInstance(Request request) {
        log.info("Deleting process instance of request with account ID: {}", request.getAccountId());
        try {
            workflowService.deleteProcessInstance(request.getProcessInstanceId(), DELETE_REASON);
            log.info("Deleted process instance of request with account ID: {}", request.getAccountId());
        }
        catch (FlowableObjectNotFoundException e) {
            log.info("Process not found {} with account ID {}", request.getProcessInstanceId(), request.getAccountId());
        }
    }

    private void deleteReportingStatusHistoryByAccountId(Long accountId) {
        log.info("Deleting account reporting status history of account with ID: {}", accountId);

        entityManager.createNativeQuery("DELETE FROM account_reporting_status_history ash "
                + "USING account_reporting_status ars "
                + "WHERE ash.account_reporting_status_id = ars.id "
                + "AND ars.account_id = :accountId "
                + "AND ars.year = :year")
            .setParameter("accountId", accountId)
            .setParameter("year", YEAR)
            .executeUpdate();

        log.info("Deleted account reporting status history of account with ID: {}", accountId);
    }

    private void deleteReportingStatusByAccountId(Long accountId) {
        log.info("Deleting account reporting status of account with ID: {}", accountId);

        entityManager.createNativeQuery("DELETE FROM account_reporting_status ars "
                + "WHERE ars.account_id = :accountId AND ars.year = :year")
            .setParameter("accountId", accountId)
            .setParameter("year", YEAR)
            .executeUpdate();

        log.info("Deleted account reporting status of account with ID: {}", accountId);
    }

    private void deleteRequestActionsByRequestId(String requestId) {
        log.info("Deleting request actions of request with account ID: {}", requestId);

        entityManager.createNativeQuery("DELETE FROM request_action ra WHERE ra.request_id = :requestId")
            .setParameter("requestId", requestId)
            .executeUpdate();

        log.info("Deleted request actions of request with account ID: {}", requestId);
    }

    private void deleteRequestResourcesByRequestId(String requestId) {
        log.info("Deleting request resources of request ID: {}", requestId);

        entityManager.createNativeQuery("DELETE FROM request_resource rr WHERE rr.request_id = :requestId")
            .setParameter("requestId", requestId)
            .executeUpdate();

        log.info("Deleted request resources of request ID: {}", requestId);
    }

    private void deleteRequestTaskHistoryByRequestId(String requestId) {
        log.info("Deleting request task history of request ID: {}", requestId);

        entityManager.createNativeQuery("DELETE FROM request_task_history rth WHERE rth.request_id = :requestId")
            .setParameter("requestId", requestId)
            .executeUpdate();

        log.info("Deleted request task history of request ID: {}", requestId);
    }

    private void deleteRequestTaskByRequestId(String requestId) {
        log.info("Deleting request task of request ID: {}", requestId);

        entityManager.createNativeQuery("DELETE FROM request_task rth WHERE rth.request_id = :requestId")
            .setParameter("requestId", requestId)
            .executeUpdate();

        log.info("Deleted request task of request ID: {}", requestId);
    }

    private void deleteRequestById(String requestId) {
        log.info("Deleting request of request ID: {}", requestId);

        entityManager.createNativeQuery("DELETE FROM request r WHERE r.id = :requestId")
            .setParameter("requestId", requestId)
            .executeUpdate();

        log.info("Deleted request of request ID: {}", requestId);
    }
}
