package uk.gov.mrtm.api.mireport.executedactions;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.domain.MrtmEmissionTradingScheme;
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.account.domain.Account;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.AbstractContainerBaseTest;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.mireport.MiReportType;
import uk.gov.netz.api.mireport.executedactions.ExecutedRequestAction;
import uk.gov.netz.api.mireport.executedactions.ExecutedRequestActionsMiReportParams;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import({ObjectMapper.class, MaritimeExecutedRequestActionsRepository.class})
class MaritimeExecutedRequestActionsRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private MaritimeExecutedRequestActionsRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findExecutedRequestActions_results_when_only_mandatory_parameters_applied() {

        MrtmAccount acc1 = createAccount(1L, "account", MrtmAccountStatus.LIVE, CompetentAuthorityEnum.WALES, "0000001");
        RequestType requestType = createRequestType(MrtmRequestType.EMP_ISSUANCE);
        Request acc1Request = createRequest(acc1, "NEW1", RequestStatuses.COMPLETED, requestType);
        createRequestAction(acc1Request,
                MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_SUBMITTED,
                LocalDateTime.of(2022, 1, 5, 12, 30),
                "operator");
        RequestAction acc1RequestAction = createRequestAction(acc1Request,
                MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_APPROVED,
                LocalDateTime.of(2022, 1, 6, 15, 45),
                "regulator");
        EmissionsMonitoringPlanEntity acc1Emp = createEmp(1L, "UK-W-AV-000001");

        MrtmAccount acc2 = createAccount(2L, "account2", MrtmAccountStatus.LIVE, CompetentAuthorityEnum.ENGLAND, "0000002");
        Request acc2Request = createRequest(acc2, "NEW2", RequestStatuses.IN_PROGRESS, requestType);
        createRequestAction(acc2Request,
                MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_SUBMITTED,
                LocalDateTime.of(2022, 1, 5, 22, 30),
                "operator");
        RequestAction acc2RequestAction = createRequestAction(acc2Request,
                MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_APPROVED,
                LocalDateTime.of(2022, 1, 10, 15, 45),
                "regulator");

        ExecutedRequestActionsMiReportParams reportParams = ExecutedRequestActionsMiReportParams.builder()
                .reportType(MiReportType.COMPLETED_WORK)
                .fromDate(LocalDate.of(2022, 1, 6))
                .build();

        List<MaritimeExecutedRequestAction> actions = repository.findExecutedRequestActions(entityManager, reportParams);

        assertThat(actions).isNotEmpty();
        assertThat(actions).hasSize(2);

        MaritimeExecutedRequestAction executedRequestAction = (MaritimeExecutedRequestAction) actions.get(0);
        assertEquals(acc1.getBusinessId(), executedRequestAction.getAccountId());
        assertEquals(acc1.getStatus().getName(), executedRequestAction.getAccountStatus());
        assertEquals(acc1.getName(), executedRequestAction.getAccountName());
        assertEquals(acc1Request.getId(), executedRequestAction.getRequestId());
        assertEquals(acc1Request.getType().getCode(), executedRequestAction.getRequestType());
        assertEquals(acc1Request.getStatus(), executedRequestAction.getRequestStatus());
        assertEquals(acc1RequestAction.getType(), executedRequestAction.getRequestActionType());
        assertEquals(acc1RequestAction.getSubmitter(), executedRequestAction.getRequestActionSubmitter());
        assertEquals(acc1RequestAction.getCreationDate().truncatedTo(ChronoUnit.MILLIS),
                executedRequestAction.getRequestActionCompletionDate().truncatedTo(ChronoUnit.MILLIS));
        assertEquals(acc1Emp.getId(), executedRequestAction.getEmpId());
        assertEquals(acc1.getImoNumber(), executedRequestAction.getImoNumber());

        executedRequestAction = (MaritimeExecutedRequestAction) actions.get(1);
        assertEquals(acc2.getBusinessId(), executedRequestAction.getAccountId());
        assertEquals(acc2.getStatus().getName(), executedRequestAction.getAccountStatus());
        assertEquals(acc2.getName(), executedRequestAction.getAccountName());
        assertEquals(acc2Request.getId(), executedRequestAction.getRequestId());
        assertEquals(acc2Request.getType().getCode(), executedRequestAction.getRequestType());
        assertEquals(acc2Request.getStatus(), executedRequestAction.getRequestStatus());
        assertEquals(acc2RequestAction.getType(), executedRequestAction.getRequestActionType());
        assertEquals(acc2RequestAction.getSubmitter(), executedRequestAction.getRequestActionSubmitter());
        assertEquals(acc2RequestAction.getCreationDate().truncatedTo(ChronoUnit.MILLIS),
                executedRequestAction.getRequestActionCompletionDate().truncatedTo(ChronoUnit.MILLIS));
        assertNull(executedRequestAction.getEmpId());
        assertEquals(acc2.getImoNumber(), executedRequestAction.getImoNumber());
    }

    @Test
    void findExecutedRequestActions_results_when_all_parameters_applied() {
        MrtmAccount acc1 = createAccount(1L, "account", MrtmAccountStatus.LIVE, CompetentAuthorityEnum.WALES, "0000001");
        RequestType requestType = createRequestType(MrtmRequestType.EMP_ISSUANCE);
        Request acc1Request = createRequest(acc1, "NEW1", RequestStatuses.COMPLETED, requestType);
        createRequestAction(acc1Request,
                MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_SUBMITTED,
                LocalDateTime.of(2022, 1, 5, 0, 0),
                "operator");
        createRequestAction(acc1Request,
                MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_APPROVED,
                LocalDateTime.of(2022, 1, 6, 15, 45),
                "regulator");

        MrtmAccount acc2 = createAccount(2L, "account2", MrtmAccountStatus.LIVE, CompetentAuthorityEnum.WALES, "0000002");
        Request acc2Request = createRequest(acc2, "NEW2", RequestStatuses.IN_PROGRESS, requestType);
        createRequestAction(acc2Request,
                MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_SUBMITTED,
                LocalDateTime.of(2022, 1, 10, 0, 30),
                "operator");

        ExecutedRequestActionsMiReportParams reportParams = ExecutedRequestActionsMiReportParams.builder()
                .reportType(MiReportType.COMPLETED_WORK)
                .fromDate(LocalDate.of(2022, 1, 5))
                .toDate(LocalDate.of(2022, 1, 10))
                .build();

        List<MaritimeExecutedRequestAction> actions = repository.findExecutedRequestActions(entityManager, reportParams);
        final List<MaritimeExecutedRequestAction> mrtmExecutedRequestActions = actions.stream()
                .map(MaritimeExecutedRequestAction.class::cast)
                .toList();

        assertThat(actions).isNotEmpty();
        assertThat(actions).hasSize(3);
        assertThat(actions).extracting(ExecutedRequestAction::getAccountId)
            .containsExactlyInAnyOrderElementsOf(List.of(acc1.getBusinessId(), acc1.getBusinessId(), acc2.getBusinessId()));
        assertThat(mrtmExecutedRequestActions).extracting(MaritimeExecutedRequestAction::getImoNumber)
            .containsExactlyInAnyOrderElementsOf(List.of(acc1.getImoNumber(), acc1.getImoNumber(), acc2.getImoNumber()));
    }


    private MrtmAccount createAccount(Long id, String name, MrtmAccountStatus status,
                                      CompetentAuthorityEnum competentAuthority, String imoNumber) {

        MrtmAccount account = MrtmAccount.builder()
                .id(id)
                .name(name)
                .status(status)
                .competentAuthority(competentAuthority)
                .emissionTradingScheme(MrtmEmissionTradingScheme.UK_MARITIME_EMISSION_TRADING_SCHEME)
                .firstMaritimeActivityDate(LocalDate.of(2022, 1, 1))
                .businessId(String.valueOf(id))
                .imoNumber(imoNumber)
                .address(AddressState.builder()
                        .line1("line1")
                        .city("city")
                        .country("country")
                        .state("state")
                        .postcode("postcode")
                        .build())
                .build();

        entityManager.persist(account);
        return account;
    }

    private Request createRequest(Account account, String requestId, String status, RequestType requestType) {

        Request request = Request.builder()
                .id(requestId)
                .type(requestType)
                .status(status)
                .build();
        RequestResource accountRequestResource = RequestResource.builder().request(request).resourceId(String.valueOf(account.getId())).resourceType(ResourceType.ACCOUNT).build();
        RequestResource caRequestResource = RequestResource.builder().request(request).resourceId(account.getCompetentAuthority().name()).resourceType(ResourceType.CA).build();
        request.getRequestResources().add(accountRequestResource);
        request.getRequestResources().add(caRequestResource);
        entityManager.persist(request);
        entityManager.persist(accountRequestResource);
        entityManager.persist(caRequestResource);
        flushAndClear();
        return request;
    }

    private RequestType createRequestType(String type) {

        RequestType requestType = RequestType.builder()
                .code(type)
                .description("Description")
                .processDefinitionId("PROCESS_" + type)
                .historyCategory("PERMIT")
                .resourceType(ResourceType.ACCOUNT)
                .build();
        entityManager.persist(requestType);
        flushAndClear();
        return requestType;
    }

    private RequestAction createRequestAction(Request request, String type, LocalDateTime creationDate, String submitter) {
        RequestAction requestAction = RequestAction.builder()
                .request(request)
                .type(type)
                .submitter(submitter)
                .build();

        entityManager.persist(requestAction);

        requestAction.setCreationDate(creationDate);
        entityManager.merge(requestAction);

        return requestAction;
    }

    private EmissionsMonitoringPlanEntity createEmp(Long accountId, String empId) {
        EmissionsMonitoringPlanEntity emp = EmissionsMonitoringPlanEntity.builder().id(empId)
                .accountId(accountId)
                .build();
        emp.setConsolidationNumber(1);
        entityManager.persist(emp);
        return emp;
    }

    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}
