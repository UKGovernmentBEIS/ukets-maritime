package uk.gov.mrtm.api.migration.aer;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.actuate.autoconfigure.endpoint.condition.ConditionalOnAvailableEndpoint;
import org.springframework.boot.actuate.endpoint.annotation.DeleteOperation;
import org.springframework.boot.actuate.endpoint.web.annotation.WebEndpoint;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.workflow.request.WorkflowService;

import java.util.List;

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
    public List<String> delete2026Aer(List<String> processInstanceIds) {
        log.info("START aer-2026-delete MIGRATION SERVICE!");

        if (processInstanceIds == null || processInstanceIds.isEmpty()) {
            log.info("Fetching eligible requests...");
            processInstanceIds = findByRequestTypeAndMetadataYear();
        }
        log.info("Eligible processes with ids: {}", processInstanceIds);

        for (String id : processInstanceIds) {
            deleteProcessInstance(id);
        }

        log.info("END aer-2026-delete MIGRATION SERVICE!");
        return processInstanceIds;
    }

    private List<String> findByRequestTypeAndMetadataYear() {
        return (List<String>) entityManager.createNativeQuery("SELECT r.process_instance_id FROM request r "
                + "JOIN request_type rt ON r.type_id = rt.id "
                + "WHERE rt.code = :requestType "
                + "AND cast(r.metadata->>'year' as INTEGER) = :year", String.class)
            .setParameter("requestType", MrtmRequestType.AER)
            .setParameter("year", YEAR)
            .getResultList();
    }

    private void deleteProcessInstance(String processInstanceId) {
        log.info("Deleting process instance of request with process instance ID: {}", processInstanceId);
        try {
            workflowService.deleteProcessInstance(processInstanceId, DELETE_REASON);
            log.info("Deleted process instance of request with process instance ID: {}", processInstanceId);
        }
        catch (Exception e) {
            log.warn("Error for process instance {} exception: {}", processInstanceId, e);
        }
    }
}
