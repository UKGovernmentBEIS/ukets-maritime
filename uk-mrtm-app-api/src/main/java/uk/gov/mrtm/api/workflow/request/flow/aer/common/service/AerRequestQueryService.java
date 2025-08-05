package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.repository.RequestCustomRepository;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.repository.RequestRepository;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AerRequestQueryService {

    private final RequestRepository requestRepository;
    private final RequestCustomRepository requestCustomRepository;

    public Optional<LocalDateTime> findEndDateOfApprovedEmpIssuanceByAccountId(Long accountId,
                                                                               String requestType) {

        return requestRepository.findByAccountIdAndTypeAndStatus(accountId, requestType,
                        EmpIssuanceDeterminationType.APPROVED.name())
                .stream()
                .map(Request::getEndDate)
                .findFirst();
    }

    public Set<Year> findAerRequestsReportingYearByAccountId(Long accountId) {

        return requestRepository.findByRequestTypeAndResourceTypeAndResourceId(MrtmRequestType.AER, ResourceType.ACCOUNT, String.valueOf(accountId))
                .stream()
                .map(Request::getMetadata)
                .map(requestMetadata -> ((AerRequestMetadata) requestMetadata).getYear())
                .collect(Collectors.toSet());
    }

    public Optional<Request> findRequestByAccountAndTypeForYear(Long accountId,
                                                                Year year){
        return requestCustomRepository
            .findByRequestTypeAndResourceAndMetadataYear(MrtmRequestType.AER, ResourceType.ACCOUNT,
                String.valueOf(accountId), year.getValue()).stream().findFirst();
    }
}
