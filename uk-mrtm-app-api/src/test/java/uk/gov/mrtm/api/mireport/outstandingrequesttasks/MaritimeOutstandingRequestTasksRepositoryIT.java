package uk.gov.mrtm.api.mireport.outstandingrequesttasks;

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
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.account.domain.Account;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.AbstractContainerBaseTest;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.mireport.outstandingrequesttasks.OutstandingRegulatorRequestTasksMiReportParams;
import uk.gov.netz.api.mireport.outstandingrequesttasks.OutstandingRequestTask;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import({ObjectMapper.class, MaritimeOutstandingRequestTasksRepository.class})
class MaritimeOutstandingRequestTasksRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private MaritimeOutstandingRequestTasksRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findOutstandingRequestTaskByCaAndParams_without_user_ids() {
        UUID assigne1 = UUID.randomUUID();
        UUID assigne2 = UUID.randomUUID();
        UUID assigne3 = UUID.randomUUID();
        UUID assigne4 = UUID.randomUUID();
        String imoNumber1 = "0000001";
        String imoNumber2 = "0000002";
        String imoNumber3 = "0000003";
        String imoNumber4 = "0000004";

        MrtmAccount acc1 = createAccount(1L, "account1", MrtmAccountStatus.LIVE, CompetentAuthorityEnum.WALES, imoNumber1);

        RequestType empIssuanceRequestType = createRequestType(MrtmRequestType.EMP_ISSUANCE);
        RequestType empVariationRequestType = createRequestType(MrtmRequestType.EMP_VARIATION);
        RequestTaskType empIssuanceRequestTaskType = createRequestTaskType(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW, empIssuanceRequestType);
        RequestTaskType empVariationRequestTaskType = createRequestTaskType(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW, empVariationRequestType);
        Request acc1EmpIssRequest = createRequest(acc1, "NEW1", RequestStatuses.IN_PROGRESS, empIssuanceRequestType);

        createRequestTask(acc1EmpIssRequest, empIssuanceRequestTaskType, assigne1,
                LocalDate.now().plusDays(10), LocalDate.now().plusDays(5));

        MrtmAccount acc2 = createAccount(2L, "account2", MrtmAccountStatus.LIVE, CompetentAuthorityEnum.WALES, imoNumber2);
        Request acc2EmpVariationAppReview = createRequest(acc2, "NEW2", RequestStatuses.IN_PROGRESS, empVariationRequestType);
        createRequestTask(acc2EmpVariationAppReview, empVariationRequestTaskType, assigne2, null, null);

        MrtmAccount acc3 = createAccount(3L, "account3", MrtmAccountStatus.LIVE, CompetentAuthorityEnum.ENGLAND, imoNumber3);
        Request acc3EmpVariationAppReview = createRequest(acc3, "NEW3", RequestStatuses.IN_PROGRESS, empVariationRequestType);
        createRequestTask(acc3EmpVariationAppReview, empVariationRequestTaskType, assigne3, null, null);

        MrtmAccount acc4 = createAccount(4L, "account4", MrtmAccountStatus.LIVE, CompetentAuthorityEnum.SCOTLAND, imoNumber4);
        Request acc4EmpVariationAppReview = createRequest(acc4, "NEW4", RequestStatuses.IN_PROGRESS, empVariationRequestType);
        createRequestTask(acc4EmpVariationAppReview, empVariationRequestTaskType, assigne4, null, null);

        OutstandingRegulatorRequestTasksMiReportParams params = OutstandingRegulatorRequestTasksMiReportParams.builder()
                .requestTaskTypes(Set.of(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW, MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW))
                .build();

        List<MaritimeOutstandingRequestTask> outstandingRequestTasks = repository.findOutstandingRequestTaskParams(entityManager, params);

        assertThat(outstandingRequestTasks).hasSize(4);

        assertThat(outstandingRequestTasks).extracting(OutstandingRequestTask::getRequestId).containsOnly("NEW1", "NEW2", "NEW3", "NEW4");
        assertThat(outstandingRequestTasks).extracting(OutstandingRequestTask::getAccountName).containsOnly("account1", "account2", "account3", "account4");
        assertThat(outstandingRequestTasks).extracting(OutstandingRequestTask::getRequestTaskType).containsOnly(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW, MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW);
        assertThat(outstandingRequestTasks).extracting(OutstandingRequestTask::getRequestTaskAssignee)
                .containsOnly(assigne1.toString(), assigne2.toString(), assigne3.toString(), assigne4.toString());
        assertThat(outstandingRequestTasks).extracting(OutstandingRequestTask::getRequestTaskDueDate).containsOnly(LocalDate.now().plusDays(10), null, null, null);
        assertThat(outstandingRequestTasks).extracting(OutstandingRequestTask::getRequestTaskRemainingDays).containsOnly(5L, null, null, null);
        final List<MaritimeOutstandingRequestTask> mrtmOutstandingRequestTasks = outstandingRequestTasks.stream().map(MaritimeOutstandingRequestTask.class::cast).toList();
        assertThat(mrtmOutstandingRequestTasks).extracting(MaritimeOutstandingRequestTask::getImoNumber).containsOnly(imoNumber1, imoNumber2, imoNumber3, imoNumber4);
    }


    @Test
    void findOutstandingRequestTaskByCaAndParams_with_provided_user_ids() {
        UUID user1 = UUID.randomUUID();
        UUID user2 = UUID.randomUUID();
        UUID user3 = UUID.randomUUID();
        UUID user4 = UUID.randomUUID();
        String imoNumber1 = "0000001";
        String imoNumber2 = "0000002";
        String imoNumber3 = "0000003";
        String imoNumber4 = "0000004";

        RequestType empIssuanceRequestType = createRequestType(MrtmRequestType.EMP_ISSUANCE);
        RequestType empVariationRequestType = createRequestType(MrtmRequestType.EMP_VARIATION);
        RequestTaskType empIssuanceRequestTaskType = createRequestTaskType(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW, empIssuanceRequestType);
        RequestTaskType empVariationRequestTaskType = createRequestTaskType(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW, empVariationRequestType);


        MrtmAccount acc1 = createAccount(1L, "account1", MrtmAccountStatus.LIVE, CompetentAuthorityEnum.WALES, imoNumber1);
        Request acc1EmpIssRequest = createRequest(acc1, "NEW1", RequestStatuses.IN_PROGRESS, empIssuanceRequestType);
        createRequestTask(acc1EmpIssRequest, empIssuanceRequestTaskType, user1,
                LocalDate.now().plusDays(10), LocalDate.now().plusDays(5));

        MrtmAccount acc2 = createAccount(2L, "account2", MrtmAccountStatus.LIVE, CompetentAuthorityEnum.WALES, imoNumber2);
        Request acc2EmpVariationAppReview = createRequest(acc2, "NEW2", RequestStatuses.IN_PROGRESS, empVariationRequestType);
        createRequestTask(acc2EmpVariationAppReview, empVariationRequestTaskType, user2, null, null);

        MrtmAccount acc3 = createAccount(3L, "account3", MrtmAccountStatus.LIVE, CompetentAuthorityEnum.ENGLAND, imoNumber3);
        Request acc3EmpVariationAppReview = createRequest(acc3, "NEW3", RequestStatuses.IN_PROGRESS, empVariationRequestType);
        createRequestTask(acc3EmpVariationAppReview, empVariationRequestTaskType, user3, null, null);

        MrtmAccount acc4 = createAccount(4L, "account4", MrtmAccountStatus.LIVE, CompetentAuthorityEnum.SCOTLAND, imoNumber4);
        Request acc4EmpVariationAppReview = createRequest(acc4, "NEW4", RequestStatuses.IN_PROGRESS, empVariationRequestType);
        createRequestTask(acc4EmpVariationAppReview, empVariationRequestTaskType, user4, null, null);

        OutstandingRegulatorRequestTasksMiReportParams params = OutstandingRegulatorRequestTasksMiReportParams.builder()
                .requestTaskTypes(Set.of(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW, MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW))
                .userIds(Set.of(user1.toString(), user2.toString()))
                .build();

        List<MaritimeOutstandingRequestTask> outstandingRequestTasks = repository.findOutstandingRequestTaskParams(entityManager, params);

        assertThat(outstandingRequestTasks).hasSize(2);

        assertThat(outstandingRequestTasks).extracting(OutstandingRequestTask::getRequestId).containsOnly("NEW1", "NEW2");
        assertThat(outstandingRequestTasks).extracting(OutstandingRequestTask::getAccountName).containsOnly("account1", "account2");
        assertThat(outstandingRequestTasks).extracting(OutstandingRequestTask::getRequestTaskType).containsOnly(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW, MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW);
        assertThat(outstandingRequestTasks).extracting(OutstandingRequestTask::getRequestTaskAssignee)
                .containsOnly(user1.toString(), user2.toString());
        assertThat(outstandingRequestTasks).extracting(OutstandingRequestTask::getRequestTaskDueDate).containsOnly(LocalDate.now().plusDays(10), null);
        assertThat(outstandingRequestTasks).extracting(OutstandingRequestTask::getRequestTaskRemainingDays).containsOnly(5L, null);
        final List<MaritimeOutstandingRequestTask> mrtmOutstandingRequestTasks = outstandingRequestTasks.stream().map(MaritimeOutstandingRequestTask.class::cast).toList();
        assertThat(mrtmOutstandingRequestTasks).extracting(MaritimeOutstandingRequestTask::getImoNumber).containsOnly(imoNumber1, imoNumber2);

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
                .address(getAddress())
                .imoNumber(imoNumber)
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

    private RequestTask createRequestTask(Request request, RequestTaskType type, UUID assignee, LocalDate dueDate, LocalDate pauseDate) {
        RequestTask requestTask = RequestTask.builder()
                .request(request)
                .type(type)
                .assignee(assignee.toString())
                .startDate(LocalDateTime.now())
                .pauseDate(pauseDate)
                .processTaskId(UUID.randomUUID().toString())
                .dueDate(dueDate)
                .build();

        entityManager.persist(requestTask);

        return requestTask;
    }

    private AddressState getAddress() {
        return AddressState.builder()
                .city("city")
                .country("GR")
                .line1("line")
                .postcode("postcode")
                .state("state")
                .build();
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

    private RequestTaskType createRequestTaskType(String code, RequestType requestType) {

        RequestTaskType requestTaskType = RequestTaskType.builder()
                .code(code)
                .requestType(requestType)
                .build();

        entityManager.persist(requestTaskType);
        flushAndClear();
        return requestTaskType;
    }

    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}
