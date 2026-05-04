package uk.gov.mrtm.api.integration.registry.accountcreated.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailService;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailServiceParams;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.account.AccountDetailsMessage;
import uk.gov.netz.integration.model.account.AccountHolderMessage;
import uk.gov.netz.integration.model.account.AccountOpeningEvent;
import uk.gov.netz.integration.model.account.AccountOpeningEventOutcome;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils.asStringOrEmpty;

@ExtendWith(MockitoExtension.class)
class AccountCreatedResponseHandlerTest {

    private static final String CORRELATION_ID = UUID.randomUUID().toString();
    private static final String EMITTER_ID = "MA12345";
    private static final String IMO_NUMBER = "7654321";
    private static final String EMP_ID = "UK-E-MA00001";
    private static final LocalDate NOW = LocalDate.now();

    @InjectMocks
    private AccountCreatedResponseHandler service;

    @Mock
    private MrtmAccountRepository accountRepository;
    @Mock
    private NotifyRegistryEmailService notifyRegistryEmailService;
    @Mock
    private RegistryIntegrationEmailProperties emailProperties;

    @Test
    void handleResponse_success() {
        AccountOpeningEventOutcome event = AccountOpeningEventOutcome.builder()
            .outcome(IntegrationEventOutcome.SUCCESS)
            .event(AccountOpeningEvent.builder()
                .accountDetails(
                    AccountDetailsMessage.builder()
                        .build())
                .build())
            .build();

        service.handleResponse(event, CORRELATION_ID);

        verifyNoInteractions(accountRepository,  notifyRegistryEmailService, emailProperties);
    }

    @Test
    void handleResponse_error_with_empty_list() {
        AccountOpeningEventOutcome event = AccountOpeningEventOutcome.builder()
            .outcome(IntegrationEventOutcome.ERROR)
            .errors(new ArrayList<>())
            .event(AccountOpeningEvent.builder()
                .accountDetails(
                    AccountDetailsMessage.builder()
                        .build())
                .build())
            .build();

        service.handleResponse(event, CORRELATION_ID);

        verifyNoInteractions(accountRepository,  notifyRegistryEmailService, emailProperties);
    }

    @Test
    void handleResponse_error_with_non_empty_list() {
        List<IntegrationEventErrorDetails> actionErrors = List.of(
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0106).build()
        );
        List<IntegrationEventErrorDetails> infoErrors = List.of(
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0100).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0101).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0102).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0103).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0104).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0105).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0107).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0108).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0109).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0110).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0111).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0112).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0113).build()
        );

        List<IntegrationEventErrorDetails> allErrors = new ArrayList<>();
        allErrors.addAll(actionErrors);
        allErrors.addAll(infoErrors);

        AccountOpeningEventOutcome event = AccountOpeningEventOutcome.builder()
            .outcome(IntegrationEventOutcome.ERROR)
            .errors(allErrors)
            .event(getAccountUpdatingEvent())
            .build();

        MrtmAccount account = MrtmAccount.builder()
            .businessId(EMITTER_ID)
            .name("accountName")
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .build();

        NotifyRegistryEmailServiceParams actionEmailParams = NotifyRegistryEmailServiceParams.builder()
            .account(account)
            .emitterId(EMITTER_ID)
            .correlationId(CORRELATION_ID)
            .errorsForMail(actionErrors)
            .recipient("test-email@example.com")
            .isFordway(false)
            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE)
            .integrationPoint("Account Created")
            .fields(getAccountOpeningFields(event.getEvent()))
            .build();
        NotifyRegistryEmailServiceParams infoEmailParams = NotifyRegistryEmailServiceParams.builder()
            .account(account)
            .emitterId(EMITTER_ID)
            .correlationId(CORRELATION_ID)
            .errorsForMail(infoErrors)
            .recipient("test-email@example.com")
            .isFordway(false)
            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_INFO_TEMPLATE)
            .integrationPoint("Account Created")
            .fields(getAccountOpeningFields(event.getEvent()))
            .build();

        when(accountRepository.findByBusinessId(EMITTER_ID)).thenReturn(account);
        when(emailProperties.getEmail()).thenReturn(Map.of(CompetentAuthorityEnum.ENGLAND.getCode(), "test-email@example.com"));

        service.handleResponse(event, CORRELATION_ID);

        verify(accountRepository).findByBusinessId(EMITTER_ID);
        verify(emailProperties).getEmail();
        verify(notifyRegistryEmailService).notifyRegulator(actionEmailParams);
        verify(notifyRegistryEmailService).notifyRegulator(infoEmailParams);

        verifyNoMoreInteractions(accountRepository,  notifyRegistryEmailService, emailProperties);
    }

    private AccountOpeningEvent getAccountUpdatingEvent() {
        return AccountOpeningEvent.builder()
            .accountDetails(getAccountDetails())
            .accountHolder(getAccountHolder())
            .build();
    }

    private static AccountHolderMessage getAccountHolder() {
        return AccountHolderMessage.builder()
            .accountHolderType("accountHolderType")
            .name("accountHolderName")
            .addressLine1("line1")
            .addressLine2("line2")
            .townOrCity("city")
            .stateOrProvince("state")
            .country("GR")
            .postalCode("postcode")
            .crnNotExist(true)
            .companyRegistrationNumber("companyRegistrationNumber")
            .crnJustification("crnJustification")
            .build();
    }

    private static AccountDetailsMessage getAccountDetails() {
        return AccountDetailsMessage.builder()
            .emitterId(EMITTER_ID)
            .monitoringPlanId(EMP_ID)
            .firstYearOfVerifiedEmissions(NOW.getYear())
            .accountName("accountName")
            .companyImoNumber(IMO_NUMBER)
            .build();
    }

    private Map<String, String> getAccountOpeningFields(AccountOpeningEvent event) {
        Map<String, String> fields = new LinkedHashMap<>();

        // account details
        fields.put(PayloadFieldsUtils.EMITTER_ID, asStringOrEmpty(event.getAccountDetails().getEmitterId()));
        fields.put(PayloadFieldsUtils.ACCOUNT_NAME, asStringOrEmpty(event.getAccountDetails().getAccountName()));
        fields.put(PayloadFieldsUtils.EMP_ID, asStringOrEmpty(event.getAccountDetails().getMonitoringPlanId()));
        fields.put(PayloadFieldsUtils.IMO_NUMBER, asStringOrEmpty(event.getAccountDetails().getCompanyImoNumber()));
        fields.put(PayloadFieldsUtils.REGULATOR, asStringOrEmpty(event.getAccountDetails().getRegulator()));
        fields.put(PayloadFieldsUtils.FIRST_YEAR_OF_VERIFIED_EMISSIONS, asStringOrEmpty(event.getAccountDetails().getFirstYearOfVerifiedEmissions()));
        //account holder
        fields.put(PayloadFieldsUtils.ACCOUNT_HOLDER_NAME, asStringOrEmpty(event.getAccountHolder().getName()));
        fields.put(PayloadFieldsUtils.ACCOUNT_HOLDER_TYPE, asStringOrEmpty(event.getAccountHolder().getAccountHolderType()));
        fields.put(PayloadFieldsUtils.ADDRESS_LINE_1, asStringOrEmpty(event.getAccountHolder().getAddressLine1()));
        fields.put(PayloadFieldsUtils.ADDRESS_LINE_2, asStringOrEmpty(event.getAccountHolder().getAddressLine2()));
        fields.put(PayloadFieldsUtils.CITY, asStringOrEmpty(event.getAccountHolder().getTownOrCity()));
        fields.put(PayloadFieldsUtils.STATE, asStringOrEmpty(event.getAccountHolder().getStateOrProvince()));
        fields.put(PayloadFieldsUtils.COUNTRY, asStringOrEmpty(event.getAccountHolder().getCountry()));
        fields.put(PayloadFieldsUtils.POSTCODE, asStringOrEmpty(event.getAccountHolder().getPostalCode()));
        fields.put(PayloadFieldsUtils.CRN_NOT_EXIST, asStringOrEmpty(event.getAccountHolder().getCrnNotExist()));
        fields.put(PayloadFieldsUtils.CRN, asStringOrEmpty(event.getAccountHolder().getCompanyRegistrationNumber()));
        fields.put(PayloadFieldsUtils.CRN_JUSTIFICATION, asStringOrEmpty(event.getAccountHolder().getCrnJustification()));

        return fields;
    }
}