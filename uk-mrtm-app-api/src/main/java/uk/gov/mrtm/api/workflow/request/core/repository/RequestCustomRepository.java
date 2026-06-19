package uk.gov.mrtm.api.workflow.request.core.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.netz.api.workflow.request.core.domain.Request;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public class RequestCustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public Optional<Request> findByRequestTypeAndResourceAndStatusAndYear(String requestType, String resourceType, String resourceId,
                                                                          Set<String> requestStatuses, int year) {
        final List<Request> resultList = entityManager.createNativeQuery("SELECT r.* FROM request r "
                        + "JOIN request_resource rr ON r.id = rr.request_id "
                        + "JOIN request_type rt ON r.type_id = rt.id "
                        + "WHERE rr.resource_type = :resourceType "
                        + "AND rr.resource_id = :resourceId "
                        + "AND rt.code = :requestType "
                        + "AND r.status in (:requestStatuses) "
                        + "AND cast(r.metadata->>'year' as INTEGER) = :year", Request.class)
                .setParameter("resourceType", resourceType)
                .setParameter("resourceId", resourceId)
                .setParameter("requestType", requestType)
                .setParameter("requestStatuses", requestStatuses)
                .setParameter("year", year)
                .getResultList();
        return resultList.stream().findFirst();
    }

    @Transactional(readOnly = true)
    public List<Request> findByRequestTypeAndResourceAndMetadataYear(String requestType, String resourceType,
                                                                         String resourceId, int year) {
        final List<Request> resultList = entityManager.createNativeQuery("SELECT r.* FROM request r "
                        + "JOIN request_resource rr ON r.id = rr.request_id "
                        + "JOIN request_type rt ON r.type_id = rt.id "
                        + "WHERE rr.resource_type = :resourceType "
                        + "AND rr.resource_id = :resourceId "
                        + "AND rt.code = :requestType "
                        + "AND cast(r.metadata->>'year' as INTEGER) = :year", Request.class)
                .setParameter("resourceType", resourceType)
                .setParameter("resourceId", resourceId)
                .setParameter("requestType", requestType)
                .setParameter("year", year)
                .getResultList();
        return resultList;
    }
}
