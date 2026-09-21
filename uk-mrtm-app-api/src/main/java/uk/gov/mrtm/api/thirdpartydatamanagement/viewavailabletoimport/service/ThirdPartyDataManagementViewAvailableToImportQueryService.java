package uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportCriteriaDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportItem;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportResponseDTO;
import uk.gov.netz.api.common.domain.PagingRequest;

import java.util.List;
import java.util.Set;

import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.AER_APPLICATION_AMENDS_SUBMIT;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.AER_APPLICATION_SUBMIT;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.EMP_VARIATION_APPLICATION_SUBMIT;

@Service
@RequiredArgsConstructor
public class ThirdPartyDataManagementViewAvailableToImportQueryService {

    @PersistenceContext
    private EntityManager entityManager;

    // Labels must stay in sync with ApiDataManagementTaskTypeToTextPipe on the frontend.
    private static final String BASE_SQL = """
        SELECT stg.id AS id, rtype.code AS request_type, am.id AS account_id, acc.name AS name,
               am.imo_number AS imo_number, NULL AS year, stg.provider_name AS provider_name,
               stg.updated_on AS received_on,
               CASE rtype.code
                   WHEN 'EMP_ISSUANCE' THEN 'Apply for an emissions monitoring plan'
                   WHEN 'EMP_VARIATION' THEN 'Apply to vary the emissions monitoring plan'
                   ELSE rtype.code
               END AS request_task_type_desc
        FROM sch_third_party_data.emp_staging stg
        INNER JOIN account_mrtm am ON stg.account_id = am.id
        INNER JOIN account acc ON acc.id = am.id
        INNER JOIN request_resource rr ON rr.resource_id = acc.id::text AND rr.resource_type = 'ACCOUNT'
        INNER JOIN request r ON rr.request_id = r.id
        INNER JOIN request_type rtype ON r.type_id = rtype.id
        INNER JOIN request_task rtask ON rtask.request_id = r.id
        INNER JOIN request_task_type rttype ON rttype.id = rtask.type_id
        WHERE stg.import_status = 'NEW'
        AND stg.import_in_progress is false
        AND am.id IN (:accountIds)
        AND rttype.code IN (:empRequestTaskTypes)
        AND (CAST(:requestType AS text) IS NULL OR rtype.code = CAST(:requestType AS text))

        UNION ALL

        SELECT stg.id AS id, rtype.code AS request_type, am.id AS account_id, acc.name AS name,
               am.imo_number AS imo_number, stg.year AS year, stg.provider_name AS provider_name,
               stg.updated_on AS received_on,
               CASE
                   WHEN stg.year IS NOT NULL THEN format('Complete %s emissions report', stg.year)
                   ELSE 'Complete annual emissions report'
               END AS request_task_type_desc
        FROM sch_third_party_data.aer_staging stg
        INNER JOIN account_mrtm am ON stg.account_id = am.id
        INNER JOIN account acc ON acc.id = am.id
        INNER JOIN request_resource rr ON rr.resource_id = acc.id::text AND rr.resource_type = 'ACCOUNT'
        INNER JOIN request r ON rr.request_id = r.id
        INNER JOIN request_type rtype ON r.type_id = rtype.id
        INNER JOIN request_task rtask ON rtask.request_id = r.id
        INNER JOIN request_task_type rttype ON rttype.id = rtask.type_id
        WHERE stg.import_status = 'NEW'
        AND stg.import_in_progress is false
        AND am.id IN (:accountIds)
        AND rttype.code IN (:aerRequestTaskTypes)
        AND (CAST(:requestType AS text) IS NULL OR rtype.code = CAST(:requestType AS text))
        AND (r.metadata ->> 'year')::int = stg.year
        AND (CAST(:year AS int) IS NULL OR stg.year = CAST(:year AS int))
        """;

    private static final String COUNT_SQL = """
        SELECT count(*) FROM (
            SELECT stg.id AS id
            FROM sch_third_party_data.emp_staging stg
            INNER JOIN account_mrtm am ON stg.account_id = am.id
            INNER JOIN account acc ON acc.id = am.id
            INNER JOIN request_resource rr ON rr.resource_id = acc.id::text AND rr.resource_type = 'ACCOUNT'
            INNER JOIN request r ON rr.request_id = r.id
            INNER JOIN request_type rtype ON r.type_id = rtype.id
            INNER JOIN request_task rtask ON rtask.request_id = r.id
            INNER JOIN request_task_type rttype ON rttype.id = rtask.type_id
            WHERE stg.import_status = 'NEW'
            AND stg.import_in_progress is false
            AND am.id IN (:accountIds)
            AND rttype.code IN (:empRequestTaskTypes)
            AND (CAST(:requestType AS text) IS NULL OR rtype.code = CAST(:requestType AS text))

            UNION ALL

            SELECT stg.id AS id
            FROM sch_third_party_data.aer_staging stg
            INNER JOIN account_mrtm am ON stg.account_id = am.id
            INNER JOIN account acc ON acc.id = am.id
            INNER JOIN request_resource rr ON rr.resource_id = acc.id::text AND rr.resource_type = 'ACCOUNT'
            INNER JOIN request r ON rr.request_id = r.id
            INNER JOIN request_type rtype ON r.type_id = rtype.id
            INNER JOIN request_task rtask ON rtask.request_id = r.id
            INNER JOIN request_task_type rttype ON rttype.id = rtask.type_id
            WHERE stg.import_status = 'NEW'
            AND stg.import_in_progress is false
            AND am.id IN (:accountIds)
            AND rttype.code IN (:aerRequestTaskTypes)
            AND (CAST(:requestType AS text) IS NULL OR rtype.code = CAST(:requestType AS text))
            AND (r.metadata ->> 'year')::int = stg.year
            AND (CAST(:year AS int) IS NULL OR stg.year = CAST(:year AS int))
        ) as count;
        """;

    private static final String ACCOUNT_COUNT_SQL = """
         SELECT COUNT(DISTINCT account_id) FROM (
            SELECT am.id AS account_id
            FROM sch_third_party_data.emp_staging stg
            INNER JOIN account_mrtm am ON stg.account_id = am.id
            INNER JOIN account acc ON acc.id = am.id
            INNER JOIN request_resource rr ON rr.resource_id = acc.id::text AND rr.resource_type = 'ACCOUNT'
            INNER JOIN request r ON rr.request_id = r.id
            INNER JOIN request_type rtype ON r.type_id = rtype.id
            INNER JOIN request_task rtask ON rtask.request_id = r.id
            INNER JOIN request_task_type rttype ON rttype.id = rtask.type_id
            WHERE stg.import_status = 'NEW'
            AND stg.import_in_progress is false
            AND am.id IN (:accountIds)
            AND rttype.code IN (:empRequestTaskTypes)
            AND (CAST(:requestType AS text) IS NULL OR rtype.code = CAST(:requestType AS text))

             UNION ALL

            SELECT am.id AS account_id
            FROM sch_third_party_data.aer_staging stg
            INNER JOIN account_mrtm am ON stg.account_id = am.id
            INNER JOIN account acc ON acc.id = am.id
            INNER JOIN request_resource rr ON rr.resource_id = acc.id::text AND rr.resource_type = 'ACCOUNT'
            INNER JOIN request r ON rr.request_id = r.id
            INNER JOIN request_type rtype ON r.type_id = rtype.id
            INNER JOIN request_task rtask ON rtask.request_id = r.id
            INNER JOIN request_task_type rttype ON rttype.id = rtask.type_id
            WHERE stg.import_status = 'NEW'
            AND stg.import_in_progress is false
            AND am.id IN (:accountIds)
            AND rttype.code IN (:aerRequestTaskTypes)
            AND (CAST(:requestType AS text) IS NULL OR rtype.code = CAST(:requestType AS text))
            AND (r.metadata ->> 'year')::int = stg.year
            AND (CAST(:year AS int) IS NULL OR stg.year = CAST(:year AS int))
         ) as accountCount;
        """;

    @SuppressWarnings("unchecked")
    @Transactional(readOnly = true)
    public ThirdPartyDataManagementAvailableToImportResponseDTO findDataAvailableToImport(
        PagingRequest pagingRequest, Set<Long> accountIds,
        ThirdPartyDataManagementAvailableToImportCriteriaDTO searchCriteria) {

        List<String> empTasks = List.of(EMP_VARIATION_APPLICATION_SUBMIT, EMP_ISSUANCE_APPLICATION_SUBMIT);
        List<String> aerTasks = List.of(AER_APPLICATION_SUBMIT, AER_APPLICATION_AMENDS_SUBMIT);
        String requestType = searchCriteria.getRequestType() != null
            ? searchCriteria.getRequestType().name()
            : null;
        String sql = BASE_SQL + String.format(
            " ORDER BY %s %s",
            searchCriteria.getSortBy().getColumn(),
            searchCriteria.getDirection().name());

        List<ThirdPartyDataManagementAvailableToImportItem> items = entityManager
            .createNativeQuery(sql, MrtmAccount.THIRD_PARTY_AVAILABLE_DATA_DTO_RESULT_MAPPER)
            .setFirstResult(pagingRequest.getPageNumber() * pagingRequest.getPageSize())
            .setMaxResults(pagingRequest.getPageSize())
            .setParameter("empRequestTaskTypes", empTasks)
            .setParameter("aerRequestTaskTypes", aerTasks)
            .setParameter("accountIds", accountIds)
            .setParameter("year", searchCriteria.getYear())
            .setParameter("requestType", requestType)
            .getResultList();

        long totalItems = (Long) entityManager.createNativeQuery(COUNT_SQL)
            .setParameter("empRequestTaskTypes", empTasks)
            .setParameter("aerRequestTaskTypes", aerTasks)
            .setParameter("accountIds", accountIds)
            .setParameter("year", searchCriteria.getYear())
            .setParameter("requestType", requestType)
            .getSingleResult();

        long totalAccounts = (Long) entityManager.createNativeQuery(ACCOUNT_COUNT_SQL)
            .setParameter("empRequestTaskTypes", empTasks)
            .setParameter("aerRequestTaskTypes", aerTasks)
            .setParameter("accountIds", accountIds)
            .setParameter("year", searchCriteria.getYear())
            .setParameter("requestType", requestType)
            .getSingleResult();

        return ThirdPartyDataManagementAvailableToImportResponseDTO.builder()
            .items(items)
            .accountsEligibleForImport(totalAccounts)
            .totalItems(totalItems)
            .totalAccounts(accountIds.size())
            .build();
    }
}
