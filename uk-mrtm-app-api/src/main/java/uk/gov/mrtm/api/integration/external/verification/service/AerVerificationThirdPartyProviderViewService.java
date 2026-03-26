package uk.gov.mrtm.api.integration.external.verification.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderStagingDetailsDTO;
import uk.gov.mrtm.api.integration.external.common.mapper.ThirdPartyDataCommonMapper;
import uk.gov.mrtm.api.integration.external.common.service.ThirdPartyProviderService;
import uk.gov.mrtm.api.integration.external.verification.domain.StagingAerVerificationEntity;
import uk.gov.mrtm.api.integration.external.verification.repository.StagingAerVerificationRepository;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Component
public class AerVerificationThirdPartyProviderViewService implements ThirdPartyProviderService {

    private final StagingAerVerificationRepository stagingAerVerificationRepository;
    private final ThirdPartyDataCommonMapper thirdPartyDataCommonMapper = Mappers.getMapper(ThirdPartyDataCommonMapper.class);

    @Override
    public ThirdPartyDataProviderStagingDetailsDTO getThirdPartyDataProviderInfo(Long accountId, RequestTaskPayload requestTaskPayload) {
        AerApplicationVerificationSubmitRequestTaskPayload taskPayload = (AerApplicationVerificationSubmitRequestTaskPayload) requestTaskPayload;

        Optional<StagingAerVerificationEntity> stagingEntity =
            stagingAerVerificationRepository.findByAccountIdAndYear(accountId, taskPayload.getReportingYear());

        return stagingEntity.map(thirdPartyDataCommonMapper::map).orElse(null);
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskType.AER_APPLICATION_VERIFICATION_SUBMIT,
            MrtmRequestTaskType.AER_AMEND_APPLICATION_VERIFICATION_SUBMIT);
    }
}
