package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.mapper.EmpReissueRequestMapper;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationMapper;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;
import uk.gov.netz.api.workflow.request.core.repository.RequestRepository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanEntity.CONSOLIDATION_NUMBER_DEFAULT_VALUE;

@Service
@RequiredArgsConstructor
public class EmpVariationRequestQueryService {

    private final RequestRepository requestRepository;
    private final EmpVariationMapper empVariationMapper = Mappers.getMapper(EmpVariationMapper.class);
    private final EmpReissueRequestMapper empReissueRequestMapper = Mappers.getMapper(EmpReissueRequestMapper.class);

    public List<EmpVariationRequestInfo> findEmpVariationRequests(Long accountId) {
        List<EmpVariationRequestInfo> empVariationRequests = requestRepository
            .findByAccountIdAndTypeAndStatus(accountId, MrtmRequestType.EMP_VARIATION, EmpVariationDeterminationType.APPROVED.name())
            .stream()
            .map(empVariationMapper::toEmpVariationRequestInfo)
            .toList();

        List<EmpVariationRequestInfo> reissueRequests = requestRepository
            .findByAccountIdAndTypeAndStatus(accountId, MrtmRequestType.EMP_REISSUE, RequestStatuses.COMPLETED)
            .stream()
            .map(empReissueRequestMapper::toEmpVariationRequestInfo)
            .toList();

        return Stream.concat(empVariationRequests.stream(), reissueRequests.stream())
            .sorted(Comparator.comparingInt(o ->
                Optional.ofNullable(o)
                    .map(EmpVariationRequestInfo::getMetadata)
                    .map(EmpVariationRequestMetadata::getEmpConsolidationNumber)
                    .orElse(CONSOLIDATION_NUMBER_DEFAULT_VALUE)
            ))
            .collect(Collectors.toList());
    }
}
