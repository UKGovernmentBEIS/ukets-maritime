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
import uk.gov.mrtm.api.workflow.request.flow.common.jsonprovider.RequestMetadataTypesProvider;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestMetadata;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.AbstractContainerBaseTest;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.bpmn.WorkflowEngineType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestMetadata;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

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
                        .lessIslandFerryDeduction(BigDecimal.TEN)
                        .less5PercentIceClassDeduction(BigDecimal.TEN)
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
                        .lessIslandFerryDeduction(BigDecimal.TEN)
                        .less5PercentIceClassDeduction(BigDecimal.TEN)
                        .build())
                .year(year)
                .build();

        final DoeRequestMetadata requestMetadata2 = DoeRequestMetadata.builder()
                .type(MrtmRequestMetadataType.DOE)
                .emissions(AerTotalReportableEmissions.builder()
                        .totalEmissions(BigDecimal.TEN)
                        .surrenderEmissions(BigDecimal.TEN)
                        .lessIslandFerryDeduction(BigDecimal.TEN)
                        .less5PercentIceClassDeduction(BigDecimal.TEN)
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
                        .lessIslandFerryDeduction(BigDecimal.TEN)
                        .less5PercentIceClassDeduction(BigDecimal.TEN)
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
