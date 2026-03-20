package uk.gov.mrtm.api.integration.registry.accountupdated.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.account.domain.AccountUpdatedRegistryEvent;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.IndividualOrganisation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.LimitedCompanyOrganisation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationLegalStatusType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.PartnershipOrganisation;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.integration.registry.accountupdated.domain.AccountUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailService;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailServiceParams;
import uk.gov.mrtm.api.integration.registry.common.RegistryCompetentAuthorityEnum;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.integration.model.account.AccountHolderMessage;
import uk.gov.netz.integration.model.account.AccountType;
import uk.gov.netz.integration.model.account.AccountUpdatingEvent;
import uk.gov.netz.integration.model.account.UpdateAccountDetailsMessage;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountUpdatedNotifyRegistryServiceTest {
    private static final Long ACCOUNT_ID = 1L;
    private static final Integer REGISTRY_ID = 1234567;
    private static final String IMO_NUMBER = "7654321";
    private static final String EMP_ID = "UK-E-MA00001";
    private static final LocalDate NOW = LocalDate.now();

    @InjectMocks
    private AccountUpdatedNotifyRegistryService service;

    @Mock
    private AccountUpdatedSendToRegistryProducer accountUpdatedSendToRegistryProducer;
    @Mock
    private KafkaTemplate<String, AccountUpdatingEvent> accountUpdatedKafkaTemplate;
    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;
    @Mock
    private NotifyRegistryEmailService notifyRegistryEmailService;
    @Mock
    private RegistryIntegrationEmailProperties emailProperties;
    @Mock
    private EmissionsMonitoringPlanQueryService empQueryService;

    @ParameterizedTest
    @MethodSource("notifyRegistrySuccessScenarios")
    void notifyRegistry(Optional<String> empId, AccountUpdatingEvent expectedEvent,
                        OrganisationStructure organisationStructure,
                        CompetentAuthorityEnum competentAuthority) {
        MrtmAccount account = MrtmAccount.builder()
            .id(ACCOUNT_ID)
            .registryId(REGISTRY_ID)
            .firstMaritimeActivityDate(NOW)
            .name("accountName")
            .imoNumber(IMO_NUMBER)
            .competentAuthority(competentAuthority)
            .build();
        EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
            .operatorName("operatorName")
            .organisationStructure(organisationStructure)
            .build();

        EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder()
            .operatorDetails(operatorDetails)
            .build();
        AccountUpdatedRegistryEvent event = AccountUpdatedRegistryEvent.builder()
            .accountId(ACCOUNT_ID)
            .emissionsMonitoringPlan(emp)
            .build();
        AccountUpdatedSubmittedEventDetails expected = AccountUpdatedSubmittedEventDetails.builder()
            .notifiedRegistry(true)
            .data(expectedEvent)
            .build();

        when(mrtmAccountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);
        when(empQueryService.getEmpIdByAccountId(ACCOUNT_ID)).thenReturn(empId);
        AccountUpdatedSubmittedEventDetails actual = service.notifyRegistry(event);

        assertThat(expected).isEqualTo(actual);
        verify(mrtmAccountQueryService).getAccountById(ACCOUNT_ID);
        verify(accountUpdatedSendToRegistryProducer).produce(expectedEvent, accountUpdatedKafkaTemplate);

        verifyNoInteractions(notifyRegistryEmailService, emailProperties);
        verifyNoMoreInteractions(mrtmAccountQueryService, accountUpdatedSendToRegistryProducer, empQueryService);
    }

    private static Stream<Arguments> notifyRegistrySuccessScenarios() {
        AccountUpdatingEvent limitedWithEmpId = AccountUpdatingEvent.builder()
            .accountDetails(getAccountDetails(EMP_ID, RegistryCompetentAuthorityEnum.EA))
            .accountHolder(getAccountHolder(false, null, "registrationNumber", "ORGANISATION", false))
            .build();

        AccountUpdatingEvent limitedWithoutEmpId = AccountUpdatingEvent.builder()
            .accountDetails(getAccountDetails(null, RegistryCompetentAuthorityEnum.SEPA))
            .accountHolder(getAccountHolder(false, null, "registrationNumber", "ORGANISATION", false))
            .build();

        LimitedCompanyOrganisation limitedCompanyOrganisation = LimitedCompanyOrganisation.builder()
            .legalStatusType(OrganisationLegalStatusType.LIMITED_COMPANY)
            .registrationNumber("registrationNumber")
            .registeredAddress(createRegisteredAddress())
            .evidenceFiles(Set.of())
            .build();

        AccountUpdatingEvent partnerShipWithEmpId = AccountUpdatingEvent.builder()
            .accountDetails(getAccountDetails(EMP_ID, RegistryCompetentAuthorityEnum.NRW))
            .accountHolder(getAccountHolder(true, "Partnership", null, "ORGANISATION", false))
            .build();

        AccountUpdatingEvent partnerShipWithoutEmpId = AccountUpdatingEvent.builder()
            .accountDetails(getAccountDetails(null, RegistryCompetentAuthorityEnum.DAERA))
            .accountHolder(getAccountHolder(true, "Partnership", null, "ORGANISATION", false))
            .build();

        PartnershipOrganisation partnerShipOrganisation = PartnershipOrganisation.builder()
            .legalStatusType(OrganisationLegalStatusType.PARTNERSHIP)
            .partnershipName("partnership name")
            .registeredAddress(createRegisteredAddress())
            .partners(Set.of("partner1", "partner2"))
            .build();


        AccountUpdatingEvent individualWithEmpId = AccountUpdatingEvent.builder()
            .accountDetails(getAccountDetails(EMP_ID, RegistryCompetentAuthorityEnum.OPRED))
            .accountHolder(getAccountHolder(true, null, null, "INDIVIDUAL", false))
            .build();

        AccountUpdatingEvent individualWithoutEmpId = AccountUpdatingEvent.builder()
            .accountDetails(getAccountDetails(null, RegistryCompetentAuthorityEnum.EA))
            .accountHolder(getAccountHolder(true, null, null, "INDIVIDUAL", false))
            .build();

        IndividualOrganisation individualOrganisation = IndividualOrganisation.builder()
            .legalStatusType(OrganisationLegalStatusType.INDIVIDUAL)
            .fullName("full name")
            .registeredAddress(createRegisteredAddress())
            .build();

        AccountUpdatingEvent partialIndividual = AccountUpdatingEvent.builder()
            .accountDetails(getAccountDetails(null, RegistryCompetentAuthorityEnum.EA))
            .accountHolder(getAccountHolder(true, null, null, "INDIVIDUAL", true))
            .build();

        IndividualOrganisation partialIndividualOrganisation = IndividualOrganisation.builder()
            .legalStatusType(OrganisationLegalStatusType.INDIVIDUAL)
            .fullName("full name")
            .build();

        AccountUpdatingEvent withoutAccountHolderInfo = AccountUpdatingEvent.builder()
            .accountDetails(getAccountDetails(null, RegistryCompetentAuthorityEnum.EA))
            .accountHolder(AccountHolderMessage.builder().build())
            .build();

        return Stream.of(
            Arguments.of(Optional.of(EMP_ID), limitedWithEmpId, limitedCompanyOrganisation, CompetentAuthorityEnum.ENGLAND),
            Arguments.of(Optional.empty(), limitedWithoutEmpId, limitedCompanyOrganisation, CompetentAuthorityEnum.SCOTLAND),
            Arguments.of(Optional.of(EMP_ID), partnerShipWithEmpId, partnerShipOrganisation, CompetentAuthorityEnum.WALES),
            Arguments.of(Optional.empty(), partnerShipWithoutEmpId, partnerShipOrganisation, CompetentAuthorityEnum.NORTHERN_IRELAND),
            Arguments.of(Optional.of(EMP_ID), individualWithEmpId, individualOrganisation, CompetentAuthorityEnum.OPRED),
            Arguments.of(Optional.empty(), individualWithoutEmpId, individualOrganisation, CompetentAuthorityEnum.ENGLAND),
            Arguments.of(Optional.empty(), partialIndividual, partialIndividualOrganisation, CompetentAuthorityEnum.ENGLAND),
            Arguments.of(Optional.empty(), withoutAccountHolderInfo, null, CompetentAuthorityEnum.ENGLAND)
        );
    }

    @Test
    void notifyRegistry_when_emp_is_null() {
        MrtmAccount account = MrtmAccount.builder().build();

        AccountUpdatedRegistryEvent event = AccountUpdatedRegistryEvent.builder()
            .accountId(ACCOUNT_ID)
            .build();
        AccountUpdatedSubmittedEventDetails expected = AccountUpdatedSubmittedEventDetails.builder()
            .notifiedRegistry(false)
            .build();

        when(mrtmAccountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);
        when(empQueryService.getEmpIdByAccountId(ACCOUNT_ID)).thenReturn(Optional.of(EMP_ID));
        AccountUpdatedSubmittedEventDetails actual = service.notifyRegistry(event);

        assertThat(expected).isEqualTo(actual);
        verify(mrtmAccountQueryService).getAccountById(ACCOUNT_ID);
        verify(empQueryService).getEmpIdByAccountId(ACCOUNT_ID);

        verifyNoInteractions(notifyRegistryEmailService, emailProperties, accountUpdatedSendToRegistryProducer);
        verifyNoMoreInteractions(mrtmAccountQueryService, empQueryService);
    }

    @Test
    void notifyRegistry_when_registry_id_is_null() {
        MrtmAccount account = MrtmAccount.builder()
            .id(ACCOUNT_ID)
            .name("accountName")
            .businessId("businessId")
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .build();

        AccountUpdatedRegistryEvent event = AccountUpdatedRegistryEvent.builder()
            .accountId(ACCOUNT_ID)
            .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder().build())
            .build();
        AccountUpdatedSubmittedEventDetails expected = AccountUpdatedSubmittedEventDetails.builder()
            .notifiedRegistry(false)
            .build();

        NotifyRegistryEmailServiceParams emailParams = NotifyRegistryEmailServiceParams.builder()
            .account(account)
            .emitterId("businessId")
            .recipient("test-email@example.com")
            .isFordway(false)
            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_ACCOUNT_UPDATE_MISSING_REGISTRY_ID_TEMPLATE)
            .integrationPoint("Account Updated")
            .build();


        when(emailProperties.getEmail()).thenReturn(Map.of(CompetentAuthorityEnum.ENGLAND.getCode(), "test-email@example.com"));
        when(mrtmAccountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);
        when(empQueryService.getEmpIdByAccountId(ACCOUNT_ID)).thenReturn(Optional.of(EMP_ID));
        AccountUpdatedSubmittedEventDetails actual = service.notifyRegistry(event);

        assertThat(expected).isEqualTo(actual);
        verify(mrtmAccountQueryService).getAccountById(ACCOUNT_ID);
        verify(empQueryService).getEmpIdByAccountId(ACCOUNT_ID);
        verify(notifyRegistryEmailService).notifyRegulator(emailParams);

        verifyNoInteractions(accountUpdatedSendToRegistryProducer);
        verifyNoMoreInteractions(emailProperties, notifyRegistryEmailService, mrtmAccountQueryService, empQueryService);
    }

    private static AccountHolderMessage getAccountHolder(boolean crnNotExist, String crnJustification,
                                                         String companyRegistrationNumber,
                                                         String accountHolderType,
                                                         boolean withoutAddress) {
        return AccountHolderMessage.builder()
            .accountHolderType(accountHolderType)
            .name("operatorName")
            .addressLine1(withoutAddress ? null : "line1")
            .addressLine2(withoutAddress ? null : "line2")
            .townOrCity(withoutAddress ? null : "city")
            .stateOrProvince(withoutAddress ? null : "state")
            .country(withoutAddress ? null : "GR")
            .postalCode(withoutAddress ? null : "postcode")
            .crnNotExist(crnNotExist)
            .companyRegistrationNumber(companyRegistrationNumber)
            .crnJustification(crnJustification)
            .build();
    }

    private static UpdateAccountDetailsMessage getAccountDetails(String empId,
                                                                 RegistryCompetentAuthorityEnum regulator) {
        return UpdateAccountDetailsMessage.builder()
            .accountType(AccountType.MARITIME_OPERATOR_HOLDING_ACCOUNT.name())
            .registryId(String.valueOf(REGISTRY_ID))
            .monitoringPlanId(empId)
            .firstYearOfVerifiedEmissions(NOW.getYear())
            .accountName("operatorName")
            .companyImoNumber(IMO_NUMBER)
            .regulator(regulator.name())
            .build();
    }

    private static AddressStateDTO createRegisteredAddress() {
        return AddressStateDTO.builder()
            .line1("line1")
            .line2("line2")
            .city("city")
            .country("GR")
            .state("state")
            .postcode("postcode")
            .build();
    }
}