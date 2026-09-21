package uk.gov.mrtm.api.workflow.request.core.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.NamedType;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.hypersistence.utils.hibernate.type.util.ObjectMapperWrapper;
import jakarta.persistence.EntityManager;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.common.jsonprovider.RequestMetadataTypesProvider;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestMetadata;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.AbstractContainerBaseTest;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.bpmn.WorkflowEngineType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestMetadata;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.AER_APPLICATION_SUBMIT;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import({ObjectMapper.class, RequestCustomRepository.class})
class RequestCustomRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private RequestCustomRepository requestCustomRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        objectMapper.registerSubtypes(new RequestMetadataTypesProvider().getTypes().toArray(NamedType[]::new));
        objectMapper.registerModule(new JavaTimeModule());
        ObjectMapperWrapper.INSTANCE.setObjectMapper(objectMapper);
    }

    @Test
    void findByAccountIdAndStatus_result_exist() {
        Long accountId = 1L;
        final Year year = Year.of(2025);
        final DoeRequestMetadata requestMetadata = DoeRequestMetadata.builder()
                .type(MrtmRequestMetadataType.DOE)
                .emissions(AerTotalReportableEmissions.builder()
                        .totalEmissions(BigDecimal.TEN)
                        .surrenderEmissions(BigDecimal.TEN)
                        .lessVoyagesInNorthernIrelandDeduction(BigDecimal.TEN)
                        .build())
                .year(year)
                .build();
        RequestType requestType = createRequestType("DOE", "descr1", "processdef1", "REPORTING", false, true, false, false, ResourceType.ACCOUNT);
        Request request = createRequest(accountId, CompetentAuthorityEnum.ENGLAND, null, requestType, "IN_PROGRESS", LocalDateTime.now(), requestMetadata);
        createRequest(accountId, CompetentAuthorityEnum.ENGLAND, null, requestType, "CANCELLED", LocalDateTime.now(), requestMetadata);

        flushAndClear();

        Optional<Request> result = requestCustomRepository.findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE,
                ResourceType.ACCOUNT, accountId.toString(), Set.of(RequestStatuses.IN_PROGRESS), year.getValue());

        assertThat(result).contains(request);
    }

    @Test
    void findByAccountIdAndStatus_no_result() {
        Long accountId = 1L;
        final Year year = Year.of(2025);
        final DoeRequestMetadata requestMetadata = DoeRequestMetadata.builder()
                .type(MrtmRequestMetadataType.DOE)
                .emissions(AerTotalReportableEmissions.builder()
                        .totalEmissions(BigDecimal.TEN)
                        .surrenderEmissions(BigDecimal.TEN)
                        .lessVoyagesInNorthernIrelandDeduction(BigDecimal.TEN)
                        .build())
                .year(year)
                .build();

        final DoeRequestMetadata requestMetadata2 = DoeRequestMetadata.builder()
                .type(MrtmRequestMetadataType.DOE)
                .emissions(AerTotalReportableEmissions.builder()
                        .totalEmissions(BigDecimal.TEN)
                        .surrenderEmissions(BigDecimal.TEN)
                        .lessVoyagesInNorthernIrelandDeduction(BigDecimal.TEN)
                        .build())
                .year(Year.of(2024))
                .build();
        RequestType requestType = createRequestType("DOE", "descr1", "processdef1", "REPORTING", false, true, false, false, ResourceType.ACCOUNT);
        createRequest(accountId, CompetentAuthorityEnum.ENGLAND, null, requestType, "IN_PROGRESS", LocalDateTime.now(), requestMetadata2);
        createRequest(accountId, CompetentAuthorityEnum.ENGLAND, null, requestType, "CANCELLED", LocalDateTime.now(), requestMetadata);

        flushAndClear();

        Optional<Request> result = requestCustomRepository.findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE,
                ResourceType.ACCOUNT, accountId.toString(), Set.of(RequestStatuses.IN_PROGRESS, RequestStatuses.COMPLETED), year.getValue());

        assertThat(result).isEmpty();
    }

    @Test
    void findAllByAccountIdAndTypeInAndMetadataYear() {
        Long accountId = 1L;
        Year year = Year.of(2023);

        final DoeRequestMetadata requestMetadata = DoeRequestMetadata.builder()
                .type(MrtmRequestMetadataType.DOE)
                .emissions(AerTotalReportableEmissions.builder()
                        .totalEmissions(BigDecimal.TEN)
                        .surrenderEmissions(BigDecimal.TEN)
                        .lessVoyagesInNorthernIrelandDeduction(BigDecimal.TEN)
                        .build())
                .year(year)
                .build();

        RequestType requestType = createRequestType("DOE", "descr1",
                "processdef1", "REPORTING", false,
                true, false, false, ResourceType.ACCOUNT);

        Request dreRequest2023_1 = createRequest(accountId, CompetentAuthorityEnum.ENGLAND, null, requestType, "IN_PROGRESS",
                LocalDateTime.now(), requestMetadata);

        Request dreRequest2023_2 = createRequest(accountId, CompetentAuthorityEnum.ENGLAND, null, requestType, "COMPLETED",
                LocalDateTime.now(), requestMetadata);

        flushAndClear();

        List<Request> result = requestCustomRepository.findByRequestTypeAndResourceAndMetadataYear(MrtmRequestType.DOE, ResourceType.ACCOUNT, String.valueOf(accountId), year.getValue());

        assertThat(result).containsExactlyInAnyOrder(dreRequest2023_1, dreRequest2023_2);
    }

    @Test
    void findByAccountRequestTaskTypeAndYear() {
        Long accountId = 1L;
        Year year = Year.of(2023);

        final AerRequestMetadata requestMetadata = AerRequestMetadata.builder()
            .type(MrtmRequestMetadataType.AER)
            .year(year)
            .build();

        RequestType requestType = createRequestType(MrtmRequestType.AER, "descr1",
            "processdef1", "REPORTING", false,
            true, false, false, ResourceType.ACCOUNT);

        RequestTaskType requestTaskType = createRequestTaskType(AER_APPLICATION_SUBMIT, requestType);

        Request aerRequest2023_1 = createRequest(accountId, CompetentAuthorityEnum.ENGLAND, null, requestType, "IN_PROGRESS",
            LocalDateTime.now(), requestMetadata);

        RequestTask aerRequestTask2023_1 = createRequestTask(aerRequest2023_1, requestTaskType);

        flushAndClear();

        Optional<RequestTask> result = requestCustomRepository.findByAccountRequestTaskTypeAndYear(List.of(AER_APPLICATION_SUBMIT),
            MrtmRequestType.AER, ResourceType.ACCOUNT, String.valueOf(accountId), year.getValue());

        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(aerRequestTask2023_1);
    }

    @Test
    void findByAccountRequestTaskTypeAndYear_no_result() {
        Long accountId = 1L;
        Year year = Year.of(2023);

        final AerRequestMetadata requestMetadata = AerRequestMetadata.builder()
            .type(MrtmRequestMetadataType.AER)
            .year(year)
            .build();

        RequestType requestType = createRequestType(MrtmRequestType.AER, "descr1",
            "processdef1", "REPORTING", false,
            true, false, false, ResourceType.ACCOUNT);

        RequestTaskType requestTaskType = createRequestTaskType(AER_APPLICATION_SUBMIT, requestType);

        Request aerRequest2023_1 = createRequest(accountId, CompetentAuthorityEnum.ENGLAND, null, requestType, "IN_PROGRESS",
            LocalDateTime.now(), requestMetadata);

        createRequestTask(aerRequest2023_1, requestTaskType);

        flushAndClear();

        Optional<RequestTask> result = requestCustomRepository.findByAccountRequestTaskTypeAndYear(List.of(AER_APPLICATION_SUBMIT),
            MrtmRequestType.AER, ResourceType.ACCOUNT, String.valueOf(accountId), year.plusYears(1).getValue());

        assertThat(result).isEmpty();
    }

    @Test
    void findByAccountAndRequestTaskType() {
        Long accountId = 1L;

        RequestType requestType = createRequestType(MrtmRequestType.EMP_ISSUANCE, "descr1",
            "processdef1", "REPORTING", false,
            true, false, false, ResourceType.ACCOUNT);

        RequestTaskType requestTaskType = createRequestTaskType(EMP_ISSUANCE_APPLICATION_SUBMIT, requestType);

        Request empRequest2023_1 = createRequest(accountId, CompetentAuthorityEnum.ENGLAND, null, requestType, "IN_PROGRESS",
            LocalDateTime.now(), null);

        RequestTask empRequestTask2023_1 = createRequestTask(empRequest2023_1, requestTaskType);

        flushAndClear();

        Optional<RequestTask> result = requestCustomRepository.findByAccountAndRequestTaskType(List.of(EMP_ISSUANCE_APPLICATION_SUBMIT),
            MrtmRequestType.EMP_ISSUANCE, ResourceType.ACCOUNT, String.valueOf(accountId));

        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(empRequestTask2023_1);
    }

    @Test
    void findByAccountAndRequestTaskType_no_result() {
        Long accountId = 1L;

        RequestType requestType = createRequestType(MrtmRequestType.EMP_ISSUANCE, "descr1",
            "processdef1", "REPORTING", false,
            true, false, false, ResourceType.ACCOUNT);

        RequestTaskType requestTaskType = createRequestTaskType(EMP_ISSUANCE_APPLICATION_SUBMIT, requestType);

        Request empRequest2023_1 = createRequest(accountId, CompetentAuthorityEnum.ENGLAND, null, requestType, "IN_PROGRESS",
            LocalDateTime.now(), null);

        createRequestTask(empRequest2023_1, requestTaskType);

        flushAndClear();

        Optional<RequestTask> result = requestCustomRepository.findByAccountAndRequestTaskType(List.of(AER_APPLICATION_SUBMIT),
            MrtmRequestType.EMP_ISSUANCE, ResourceType.ACCOUNT, String.valueOf(accountId));

        assertThat(result).isEmpty();
    }

    private RequestType createRequestType(String code, String description, String processDefinitionId,
                                          String historyCategory, boolean holdHistory, boolean displayedInProgress, boolean cascadable,
                                          boolean canCreateManually, String resourceType) {
        RequestType requestType =
                RequestType.builder()
                        .code(code)
                        .description(description)
                        .processDefinitionId(processDefinitionId)
                        .historyCategory(historyCategory)
                        .holdHistory(holdHistory)
                        .displayedInProgress(displayedInProgress)
                        .cascadable(cascadable)
                        .canCreateManually(canCreateManually)
                        .resourceType(resourceType)
                        .build();
        entityManager.persist(requestType);
        return requestType;
    }

    private RequestTaskType createRequestTaskType(String code, RequestType requestType) {
        RequestTaskType requestTaskType =
            RequestTaskType.builder()
                .code(code)
                .assignable(true)
                .expirationKey("expirationKey")
                .requestType(requestType)
                .build();
        entityManager.persist(requestTaskType);
        return requestTaskType;
    }

    private Request createRequest(Long accountId, CompetentAuthorityEnum ca, Long vbId,
                                  RequestType requestType, String status, LocalDateTime creationDate,
                                  RequestMetadata metadata) {
        Request request = Request.builder()
            .id(RandomStringUtils.insecure().next(5))
            .type(requestType)
            .engine(WorkflowEngineType.FLOWABLE)
            .status(status)
            .creationDate(creationDate)
            .metadata(metadata)
            .build();
        addResourcesToRequest(accountId, ca, vbId, request);

        entityManager.persist(request);
        return request;
    }

    private RequestTask createRequestTask(Request request, RequestTaskType type) {
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(type)
            .assignee("assignee")
            .startDate(LocalDateTime.now())
            .pauseDate(LocalDate.now())
            .processTaskId(UUID.randomUUID().toString())
            .dueDate(LocalDate.now())
            .build();
        entityManager.persist(requestTask);
        return requestTask;
    }

    private void addResourcesToRequest(Long accountId, CompetentAuthorityEnum competentAuthority, Long vbId, Request request) {
        RequestResource caResource = RequestResource.builder()
                .resourceType(ResourceType.CA)
                .resourceId(competentAuthority.name())
                .request(request)
                .build();

        request.getRequestResources().add(caResource);

        if (accountId != null) {
            RequestResource accountResource = RequestResource.builder()
                    .resourceType(ResourceType.ACCOUNT)
                    .resourceId(accountId.toString())
                    .request(request)
                    .build();

            request.getRequestResources().add(accountResource);
        }

        if (vbId != null) {
            RequestResource vbIdResource = RequestResource.builder()
                    .resourceType(ResourceType.VERIFICATION_BODY)
                    .resourceId(vbId.toString())
                    .request(request)
                    .build();
            request.getRequestResources().add(vbIdResource);
        }
    }

    protected void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}
