package uk.gov.mrtm.api.integration.external.aer.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAerEntity;
import uk.gov.mrtm.api.integration.external.aer.repository.StagingAerRepository;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderDTO;
import uk.gov.mrtm.api.integration.external.common.mapper.ThirdPartyDataCommonMapper;
import uk.gov.mrtm.api.integration.external.common.service.ThirdPartyProviderService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Component
public class AerThirdPartyProviderViewService implements ThirdPartyProviderService {

    private final StagingAerRepository stagingAerRepository;
    private final ThirdPartyDataCommonMapper thirdPartyDataCommonMapper = Mappers.getMapper(ThirdPartyDataCommonMapper.class);

    public ThirdPartyDataProviderDTO getThirdPartyDataProviderInfo(Long accountId, RequestTaskPayload requestTaskPayload) {
        AerApplicationSubmitRequestTaskPayload taskPayload = (AerApplicationSubmitRequestTaskPayload) requestTaskPayload;

        Optional<StagingAerEntity> stagingEntity =
            stagingAerRepository.findByAccountIdAndYear(accountId, taskPayload.getReportingYear());

        return stagingEntity.map(thirdPartyDataCommonMapper::map).orElse(null);
    }

    public List<String> getTypes() {
        return List.of(MrtmRequestTaskType.AER_APPLICATION_SUBMIT);
    }
}
