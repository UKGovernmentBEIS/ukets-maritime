package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.repository.RequestCustomRepository;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.repository.RequestRepository;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerRequestQueryServiceTest {

    @InjectMocks
    private AerRequestQueryService aerRequestQueryService;

    @Mock
    private RequestRepository requestRepository;

    @Mock
    private RequestCustomRepository requestCustomRepository;

    @Test
    void findEndDateOfApprovedEmpIssuanceByAccountId() {
        Long accountId = 1L;
        LocalDateTime endDate = LocalDateTime.now();

        when(requestRepository.findByAccountIdAndTypeAndStatus(accountId, MrtmRequestType.EMP_ISSUANCE,
                EmpIssuanceDeterminationType.APPROVED.name()))
                .thenReturn(List.of(Request.builder()
                        .id("id")
                        .type(RequestType.builder()
                                .code(MrtmRequestType.EMP_ISSUANCE)
                                .build())
                        .endDate(endDate)
                                .requestResources(List.of(RequestResource.builder()
                                                .resourceType(ResourceType.ACCOUNT)
                                                .resourceId(String.valueOf(accountId))
                                        .build()))
                        .status(EmpIssuanceDeterminationType.APPROVED.name())
                        .build()));

        final Optional<LocalDateTime> actual = aerRequestQueryService.findEndDateOfApprovedEmpIssuanceByAccountId(accountId, MrtmRequestType.EMP_ISSUANCE);
        assertThat(actual).isPresent();
        assertEquals(endDate, actual.get());
    }

    @Test
    void findEndDateOfApprovedEmpIssuanceByAccountId_no_result() {
        Long accountId = 1L;

        when(requestRepository.findByAccountIdAndTypeAndStatus(accountId, MrtmRequestType.EMP_ISSUANCE, EmpIssuanceDeterminationType.APPROVED.name()))
                .thenReturn(List.of());

        final Optional<LocalDateTime> actual = aerRequestQueryService.findEndDateOfApprovedEmpIssuanceByAccountId(accountId, MrtmRequestType.EMP_ISSUANCE);
        assertThat(actual).isEmpty();
    }

    @Test
    void findAerRequestsReportingYearByAccountId() {
        Long accountId = 1L;

        when(requestRepository.findByRequestTypeAndResourceTypeAndResourceId(MrtmRequestType.AER, ResourceType.ACCOUNT, String.valueOf(accountId)))
                .thenReturn(List.of(createRequest(Year.of(2024)),createRequest(Year.of(2025))));

        final Set<Year> actual = aerRequestQueryService.findAerRequestsReportingYearByAccountId(accountId);
        assertThat(actual).containsExactlyInAnyOrder(Year.of(2024), Year.of(2025));
    }

    @Test
    void findRequestByAccountAndTypeForYear() {
        Long accountId = 1L;
        Year year = Year.now();
        Request request = createRequest(Year.of(2024));

        when(requestCustomRepository.findByRequestTypeAndResourceAndMetadataYear(MrtmRequestType.AER, ResourceType.ACCOUNT, String.valueOf(accountId), year.getValue()))
            .thenReturn(List.of(request));

        final Optional<Request> actual = aerRequestQueryService.findRequestByAccountAndTypeForYear(accountId, year);
        assertThat(actual).isPresent();
        assertThat(actual.get()).isEqualTo(request);
    }


    @Test
    void findAerRequestsReportingYearByAccountId_no_requests_found() {
        Long accountId = 1L;

        when(requestRepository.findByRequestTypeAndResourceTypeAndResourceId(MrtmRequestType.AER, ResourceType.ACCOUNT, String.valueOf(accountId)))
                .thenReturn(List.of());

        final Set<Year> actual = aerRequestQueryService.findAerRequestsReportingYearByAccountId(accountId);
        assertThat(actual).isEmpty();
    }

    private Request createRequest(Year year) {
        return Request.builder()
                .metadata(AerRequestMetadata.builder()
                        .year(year)
                        .build())
                .build();
    }
}
