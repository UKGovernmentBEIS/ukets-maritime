package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;
import uk.gov.netz.api.workflow.request.core.repository.RequestRepository;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationRequestQueryServiceTest {



    private final RequestRepository requestRepository = mock(RequestRepository.class);
    private final EmpVariationRequestQueryService cut = new EmpVariationRequestQueryService(requestRepository);

    @Test
    void findEmpVariationRequests() {
        Long accountId = 1L;
        EmpVariationRequestMetadata permitVariationRequestMetadata1 = EmpVariationRequestMetadata.builder()
                .summary("log1")
                .build();
        EmpVariationRequestMetadata empVariationRequestMetadata2 = EmpVariationRequestMetadata.builder()
                .summary("log2")
                .build();

        LocalDateTime request1EndDate = LocalDateTime.now();
        LocalDateTime request2EndDate = LocalDateTime.now();
        List<Request> requests = List.of(
                Request.builder().id("request1").status(EmpVariationDeterminationType.APPROVED.name())
                        .endDate(request1EndDate)
                        .submissionDate(request1EndDate)
                        .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
                        .type(RequestType.builder().code(MrtmRequestType.EMP_VARIATION).build())
                        .metadata(permitVariationRequestMetadata1)
                        .build()
        );
        List<Request> requests2 = List.of(
            Request.builder().id("request2").status(RequestStatuses.COMPLETED)
                .endDate(request2EndDate)
                .submissionDate(request2EndDate)
                .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
                .type(RequestType.builder().code(MrtmRequestType.EMP_REISSUE).build())
                .metadata(EmpReissueRequestMetadata.builder()
                    .type(MrtmRequestMetadataType.EMP_REISSUE)
                    .summary("log2")
                    .build())
                .build()
        );

        when(requestRepository.findByAccountIdAndTypeAndStatus(accountId, MrtmRequestType.EMP_VARIATION,
                EmpVariationDeterminationType.APPROVED.name()))
                .thenReturn(requests);

        when(requestRepository.findByAccountIdAndTypeAndStatus(accountId, MrtmRequestType.EMP_REISSUE,
            RequestStatuses.COMPLETED)).thenReturn(requests2);

        List<EmpVariationRequestInfo> results = cut.findEmpVariationRequests(accountId);
        assertThat(results).containsExactlyInAnyOrder(
                EmpVariationRequestInfo.builder().endDate(request1EndDate).submissionDate(request1EndDate)
                        .id("request1").metadata(permitVariationRequestMetadata1).build(),
                EmpVariationRequestInfo.builder().endDate(request2EndDate).submissionDate(request2EndDate)
                        .id("request2").metadata(empVariationRequestMetadata2).build());
        verify(requestRepository, times(1)).findByAccountIdAndTypeAndStatus(accountId,
                MrtmRequestType.EMP_VARIATION, EmpVariationDeterminationType.APPROVED.name());
    }

}