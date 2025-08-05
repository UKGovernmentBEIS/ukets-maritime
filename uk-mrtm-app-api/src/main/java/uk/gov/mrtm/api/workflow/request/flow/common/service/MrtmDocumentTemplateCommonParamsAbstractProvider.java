package uk.gov.mrtm.api.workflow.request.flow.common.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanIdentifierGenerator;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.MrtmAccountTemplateParams;
import uk.gov.netz.api.account.domain.AccountContactType;
import uk.gov.netz.api.account.service.AccountContactQueryService;
import uk.gov.netz.api.common.config.CompetentAuthorityProperties;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.competentauthority.CompetentAuthorityService;
import uk.gov.netz.api.referencedata.domain.Country;
import uk.gov.netz.api.referencedata.service.CountryService;
import uk.gov.netz.api.user.core.service.auth.UserAuthService;
import uk.gov.netz.api.user.regulator.service.RegulatorUserAuthService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateCommonParamsAbstractProvider;

import java.util.Optional;


@Service
public class MrtmDocumentTemplateCommonParamsAbstractProvider extends DocumentTemplateCommonParamsAbstractProvider {

    private final MrtmAccountQueryService mrtmAccountQueryService;
    private final CountryService countryService;
    private final AccountContactQueryService accountContactQueryService;
    private final UserAuthService userAuthService;
    private final EmissionsMonitoringPlanQueryService empQueryService;
    private final EmissionsMonitoringPlanIdentifierGenerator generator;

    public MrtmDocumentTemplateCommonParamsAbstractProvider(RegulatorUserAuthService regulatorUserAuthService,
                                                            UserAuthService userAuthService,
                                                            EmissionsMonitoringPlanQueryService empQueryService,
                                                            CompetentAuthorityProperties competentAuthorityProperties,
                                                            DateService dateService,
                                                            CompetentAuthorityService competentAuthorityService,
                                                            MrtmAccountQueryService mrtmAccountQueryService,
                                                            CountryService countryService,
                                                            AccountContactQueryService accountContactQueryService,
                                                            EmissionsMonitoringPlanIdentifierGenerator generator) {
        super(regulatorUserAuthService, userAuthService, competentAuthorityProperties, dateService, competentAuthorityService);
        this.mrtmAccountQueryService = mrtmAccountQueryService;
        this.countryService = countryService;
        this.accountContactQueryService = accountContactQueryService;
        this.userAuthService = userAuthService;
        this.empQueryService = empQueryService;
        this.generator = generator;
    }

    @Override
    public String getPermitReferenceId(Long accountId) {
        return  empQueryService.getEmpIdByAccountId(accountId).orElse(generator.generate(accountId));
    }

    @Override
    public MrtmAccountTemplateParams getAccountTemplateParams(Long accountId) {
        MrtmAccount mrtmAccount = mrtmAccountQueryService.getAccountById(accountId);

        final Optional<UserInfoDTO> serviceContact = accountContactQueryService
            .findContactByAccountAndContactType(accountId, AccountContactType.SERVICE)
            .map(userAuthService::getUserByUserId);

        final Optional<UserInfoDTO> primaryContact = accountContactQueryService
            .findContactByAccountAndContactType(accountId, AccountContactType.PRIMARY)
            .map(userAuthService::getUserByUserId);

        return MrtmAccountTemplateParams.builder()
            .name(mrtmAccount.getName())
            .competentAuthority(mrtmAccount.getCompetentAuthority())
            .imoNumber(mrtmAccount.getImoNumber())
            .location(constructAddressInfo(mrtmAccount.getAddress()))
            .primaryContact(primaryContact.map(UserInfoDTO::getFullName).orElse(null))
            .primaryContactEmail(primaryContact.map(UserInfoDTO::getEmail).orElse(null))
            .serviceContact(serviceContact.map(UserInfoDTO::getFullName).orElse(null))
            .serviceContactFirstName(serviceContact.map(UserInfoDTO::getFirstName).orElse(null))
            .serviceContactEmail(serviceContact.map(UserInfoDTO::getEmail).orElse(null))
            .build();
    }

    private String constructAddressInfo(AddressState address) {
        String countryName = countryService.getReferenceData().stream()
            .filter(country -> address.getCountry().equals(country.getCode()))
            .map(Country::getName)
            .findFirst().orElse("");

        StringBuilder addressBuilder = new StringBuilder();
        addressBuilder.append(address.getLine1());
        Optional.ofNullable(address.getLine2()).ifPresent(line2 -> addressBuilder.append("\n").append(line2));
        addressBuilder.append("\n").append(address.getCity());
        Optional.ofNullable(address.getPostcode()).ifPresent(postcode -> addressBuilder.append("\n").append(postcode));
        addressBuilder.append("\n").append(countryName);
        return addressBuilder.toString();
    }
}