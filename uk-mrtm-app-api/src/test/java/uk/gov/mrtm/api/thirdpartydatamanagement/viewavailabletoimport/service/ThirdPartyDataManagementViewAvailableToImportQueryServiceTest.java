package uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportCriteriaDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportItem;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportResponseDTO;
import uk.gov.netz.api.common.domain.PagingRequest;

import java.time.Year;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.AER_APPLICATION_AMENDS_SUBMIT;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.AER_APPLICATION_SUBMIT;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.EMP_VARIATION_APPLICATION_SUBMIT;

@ExtendWith(MockitoExtension.class)
class ThirdPartyDataManagementViewAvailableToImportQueryServiceTest {

    @InjectMocks
    private ThirdPartyDataManagementViewAvailableToImportQueryService service;

    @Mock
    private EntityManager entityManager;

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

    @Test
    void findDataAvailableToImport() {
        ThirdPartyDataRequestType requestType = mock(ThirdPartyDataRequestType.class);
        PagingRequest pagingRequest = PagingRequest.builder().pageNumber(10).pageSize(20).build();
        Set<Long> accountIds = Set.of(1L, 2L);
        List<String> empTasks = List.of(EMP_VARIATION_APPLICATION_SUBMIT, EMP_ISSUANCE_APPLICATION_SUBMIT);
        List<String> aerTasks = List.of(AER_APPLICATION_SUBMIT, AER_APPLICATION_AMENDS_SUBMIT);
        Year year = Year.now();
        String requestTypeName = "request-type";
        ThirdPartyDataManagementAvailableToImportCriteriaDTO searchCriteria =
            ThirdPartyDataManagementAvailableToImportCriteriaDTO.builder()
                .requestType(requestType)
                .year(year).build();
        Query baseQuery = mock(Query.class);
        Query setFirstResultQuery = mock(Query.class);
        Query setMaxResultsQuery = mock(Query.class);
        Query empRequestTaskTypesQuery = mock(Query.class);
        Query aerRequestTaskTypesQuery = mock(Query.class);
        Query yearQuery = mock(Query.class);
        Query requestTypeQuery = mock(Query.class);
        Query accountIdsQuery = mock(Query.class);
        List<ThirdPartyDataManagementAvailableToImportItem> items = List.of(mock(ThirdPartyDataManagementAvailableToImportItem.class));

        when(requestType.name()).thenReturn(requestTypeName);
        when(entityManager.createNativeQuery(BASE_SQL + " ORDER BY received_on DESC",
            MrtmAccount.THIRD_PARTY_AVAILABLE_DATA_DTO_RESULT_MAPPER)).thenReturn(baseQuery);
        when(baseQuery.setFirstResult(200)).thenReturn(setFirstResultQuery);
        when(setFirstResultQuery.setMaxResults(20)).thenReturn(setMaxResultsQuery);
        when(setMaxResultsQuery.setParameter("empRequestTaskTypes", empTasks)).thenReturn(empRequestTaskTypesQuery);
        when(empRequestTaskTypesQuery.setParameter("aerRequestTaskTypes", aerTasks)).thenReturn(aerRequestTaskTypesQuery);
        when(aerRequestTaskTypesQuery.setParameter("accountIds", accountIds)).thenReturn(accountIdsQuery);
        when(accountIdsQuery.setParameter("year", year)).thenReturn(yearQuery);
        when(yearQuery.setParameter("requestType", requestTypeName)).thenReturn(requestTypeQuery);
        when(requestTypeQuery.getResultList()).thenReturn(items);

        Query countQuery = mock(Query.class);
        Query countEmpRequestTaskTypesQuery = mock(Query.class);
        Query countAerRequestTaskTypesQuery = mock(Query.class);
        Query countYearQuery = mock(Query.class);
        Query countRequestTypeQuery = mock(Query.class);
        Query countAccountIdsQuery = mock(Query.class);
        long totalItems = 500;

        when(entityManager.createNativeQuery(COUNT_SQL)).thenReturn(countQuery);
        when(countQuery.setParameter("empRequestTaskTypes", empTasks)).thenReturn(countEmpRequestTaskTypesQuery);
        when(countEmpRequestTaskTypesQuery.setParameter("aerRequestTaskTypes", aerTasks)).thenReturn(countAerRequestTaskTypesQuery);
        when(countAerRequestTaskTypesQuery.setParameter("accountIds", accountIds)).thenReturn(countAccountIdsQuery);
        when(countAccountIdsQuery.setParameter("year", year)).thenReturn(countYearQuery);
        when(countYearQuery.setParameter("requestType", requestTypeName)).thenReturn(countRequestTypeQuery);
        when(countRequestTypeQuery.getSingleResult()).thenReturn(totalItems);

        Query accountCountQuery = mock(Query.class);
        Query accountCountEmpRequestTaskTypesQuery = mock(Query.class);
        Query accountCountAerRequestTaskTypesQuery = mock(Query.class);
        Query accountCountYearQuery = mock(Query.class);
        Query accountCountRequestTypeQuery = mock(Query.class);
        Query accountCountAccountIdsQuery = mock(Query.class);
        long totalAccounts = 600;

        when(entityManager.createNativeQuery(ACCOUNT_COUNT_SQL)).thenReturn(accountCountQuery);
        when(accountCountQuery.setParameter("empRequestTaskTypes", empTasks)).thenReturn(accountCountEmpRequestTaskTypesQuery);
        when(accountCountEmpRequestTaskTypesQuery.setParameter("aerRequestTaskTypes", aerTasks)).thenReturn(accountCountAerRequestTaskTypesQuery);
        when(accountCountAerRequestTaskTypesQuery.setParameter("accountIds", accountIds)).thenReturn(accountCountAccountIdsQuery);
        when(accountCountAccountIdsQuery.setParameter("year", year)).thenReturn(accountCountYearQuery);
        when(accountCountYearQuery.setParameter("requestType", requestTypeName)).thenReturn(accountCountRequestTypeQuery);
        when(accountCountRequestTypeQuery.getSingleResult()).thenReturn(totalAccounts);

        ThirdPartyDataManagementAvailableToImportResponseDTO expected = ThirdPartyDataManagementAvailableToImportResponseDTO.builder()
            .items(items)
            .accountsEligibleForImport(totalAccounts)
            .totalItems(totalItems)
            .totalAccounts(accountIds.size())
            .build();

        ThirdPartyDataManagementAvailableToImportResponseDTO actual = service.findDataAvailableToImport(pagingRequest, accountIds, searchCriteria);

        assertThat(expected).isEqualTo(actual);
    }
}
