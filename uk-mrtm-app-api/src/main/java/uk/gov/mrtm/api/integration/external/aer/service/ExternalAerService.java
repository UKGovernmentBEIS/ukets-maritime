package uk.gov.mrtm.api.integration.external.aer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.integration.external.aer.domain.ExternalAer;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAer;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAerEntity;
import uk.gov.mrtm.api.integration.external.aer.repository.StagingAerRepository;
import uk.gov.mrtm.api.integration.external.aer.transform.ExternalAerMapper;
import uk.gov.mrtm.api.integration.external.aer.validation.ExternalAerValidator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerRequestQueryService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.thirdpartydataprovider.domain.ThirdPartyDataProvider;
import uk.gov.netz.api.thirdpartydataprovider.repository.ThirdPartyDataProviderRepository;
import uk.gov.netz.api.workflow.request.core.domain.Request;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.Optional;

import static uk.gov.mrtm.api.common.exception.MrtmErrorCode.AER_NOT_FOUND;
import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "feature-flag.external.integration.aer.enabled", havingValue = "true")
public class ExternalAerService {

    private final ExternalAerMapper mapper;
    private final ExternalAerValidator validator;
    private final MrtmAccountRepository mrtmAccountRepository;
    private final StagingAerRepository stagingAerRepository;
    private final DateService dateService;
    private final ThirdPartyDataProviderRepository thirdPartyDataProviderRepository;
    private final AerRequestQueryService aerRequestQueryService;

    @Transactional
    public void submitAerData(ExternalAer external, String companyImoNumber,
                              Year year, AppUser appUser) {

        StagingAer staging = mapper.toStagingAer(external);
        validator.validate(staging);

        MrtmAccount account = mrtmAccountRepository
            .findByImoNumber(companyImoNumber)
            .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        validateAerRequestTaskExists(year, account.getId());

        Optional<StagingAerEntity> optionalStagingAerEntity =
            stagingAerRepository.findByAccountIdAndYear(account.getId(), year);

        LocalDateTime now = dateService.getLocalDateTime();

        Long thirdPartyDataProviderId = appUser.getAuthorities().getFirst().getThirdPartyDataProviderId();
        ThirdPartyDataProvider thirdPartyDataProvider = thirdPartyDataProviderRepository.findById(thirdPartyDataProviderId)
            .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        if (optionalStagingAerEntity.isPresent()) {
            StagingAerEntity stagingAerEntity = optionalStagingAerEntity.get();
            stagingAerEntity.setPayload(staging);
            stagingAerEntity.setUpdatedOn(now);
            stagingAerEntity.setProviderName(thirdPartyDataProvider.getName());

            stagingAerRepository.save(stagingAerEntity);
        } else {
            stagingAerRepository.save(
                StagingAerEntity.builder()
                    .payload(staging)
                    .year(year)
                    .accountId(account.getId())
                    .createdOn(now)
                    .updatedOn(now)
                    .providerName(thirdPartyDataProvider.getName())
                    .build()
            );
        }
    }

    private void validateAerRequestTaskExists(Year year, Long accountId) {
        Optional<Request> aerRequestTask = aerRequestQueryService.findRequestByAccountAndTypeForYear(accountId, year);
        if (aerRequestTask.isEmpty()) {
            throw new BusinessException(AER_NOT_FOUND, year);
        }
    }
}
