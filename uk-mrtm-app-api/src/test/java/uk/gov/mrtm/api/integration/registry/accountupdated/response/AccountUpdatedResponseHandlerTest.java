package uk.gov.mrtm.api.integration.registry.accountupdated.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.account.AccountHolderMessage;
import uk.gov.netz.integration.model.account.AccountType;
import uk.gov.netz.integration.model.account.AccountUpdatingEvent;
import uk.gov.netz.integration.model.account.AccountUpdatingEventOutcome;
import uk.gov.netz.integration.model.account.UpdateAccountDetailsMessage;
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

@ExtendWith(MockitoExtension.class)
class AccountUpdatedResponseHandlerTest {

    private static final String CORRELATION_ID = UUID.randomUUID().toString();
    private static final String REGISTRY_ID = "1234567";
    private static final String IMO_NUMBER = "7654321";
    private static final String EMP_ID = "UK-E-MA00001";
    private static final LocalDate NOW = LocalDate.now();

    @InjectMocks
    private AccountUpdatedResponseHandler service;

    @Mock
    private MrtmAccountQueryService accountQueryService;
    @Mock
    private NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;
    @Mock
    private RegistryIntegrationEmailProperties emailProperties;

    @Test
    void handleResponse_success() {
        AccountUpdatingEventOutcome event = AccountUpdatingEventOutcome.builder()
            .outcome(IntegrationEventOutcome.SUCCESS)
            .event(AccountUpdatingEvent.builder()
                .accountDetails(
                    UpdateAccountDetailsMessage.builder()
                        .registryId(REGISTRY_ID)
                        .build())
                .build())
            .build();

        service.handleResponse(event, CORRELATION_ID);

        verifyNoInteractions(accountQueryService,  notificationEmailService, emailProperties);
    }

    @Test
    void handleResponse_error_with_empty_list() {
        AccountUpdatingEventOutcome event = AccountUpdatingEventOutcome.builder()
            .outcome(IntegrationEventOutcome.ERROR)
            .errors(new ArrayList<>())
            .event(AccountUpdatingEvent.builder()
                .accountDetails(
                    UpdateAccountDetailsMessage.builder()
                        .registryId(REGISTRY_ID)
                        .build())
                .build())
            .build();

        service.handleResponse(event, CORRELATION_ID);

        verifyNoInteractions(accountQueryService,  notificationEmailService, emailProperties);
    }

    @Test
    void handleResponse_error_with_non_empty_list() {
        List<IntegrationEventErrorDetails> actionErrors = List.of(
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0306).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0311).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0313).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0314).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0315).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0317).build()
        );
        List<IntegrationEventErrorDetails> infoErrors = List.of(
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0301).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0303).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0304).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0307).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0308).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0309).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0310).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0312).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0316).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0318).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0319).build()
        );

        List<IntegrationEventErrorDetails> allErrors = new ArrayList<>();
        allErrors.addAll(actionErrors);
        allErrors.addAll(infoErrors);

        AccountUpdatingEventOutcome event = AccountUpdatingEventOutcome.builder()
            .outcome(IntegrationEventOutcome.ERROR)
            .errors(allErrors)
            .event(getAccountUpdatingEvent())
            .build();

        Map<String, Object> infoTemplateParams = Map.of(
            MrtmEmailNotificationTemplateConstants.EMITTER_ID, "businessId",
            MrtmEmailNotificationTemplateConstants.ERRORS, infoErrors,
            MrtmEmailNotificationTemplateConstants.CORRELATION_ID, CORRELATION_ID,
            MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM, "Maritime",
            MrtmEmailNotificationTemplateConstants.OPERATOR_NAME, "accountName",
            MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT, "Account updated",
            MrtmEmailNotificationTemplateConstants.FIELDS, getEventFields());

        Map<String, Object> actionTemplateParams = Map.of(
            MrtmEmailNotificationTemplateConstants.EMITTER_ID, "businessId",
            MrtmEmailNotificationTemplateConstants.ERRORS, actionErrors,
            MrtmEmailNotificationTemplateConstants.CORRELATION_ID, CORRELATION_ID,
            MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM, "Maritime",
            MrtmEmailNotificationTemplateConstants.OPERATOR_NAME, "accountName",
            MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT, "Account updated",
            MrtmEmailNotificationTemplateConstants.FIELDS, getEventFields());

        MrtmAccount account = MrtmAccount.builder()
            .businessId("businessId")
            .name("accountName")
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .build();
        EmailData<EmailNotificationTemplateData> actionEmailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE)
                .templateParams(actionTemplateParams)
                .build())
            .build();
        EmailData<EmailNotificationTemplateData> infoEmailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_INFO_TEMPLATE)
                .templateParams(infoTemplateParams)
                .build())
            .build();

        when(accountQueryService.getAccountByRegistryId(Integer.valueOf(REGISTRY_ID))).thenReturn(account);
        when(emailProperties.getEmail()).thenReturn(Map.of(CompetentAuthorityEnum.ENGLAND.getCode(), "test-email@example.com"));

        service.handleResponse(event, CORRELATION_ID);

        verify(accountQueryService).getAccountByRegistryId(Integer.valueOf(REGISTRY_ID));
        verify(emailProperties).getEmail();
        verify(notificationEmailService).notifyRecipient(actionEmailData, "test-email@example.com");
        verify(notificationEmailService).notifyRecipient(infoEmailData, "test-email@example.com");

        verifyNoMoreInteractions(accountQueryService,  notificationEmailService, emailProperties);
    }

    private AccountUpdatingEvent getAccountUpdatingEvent() {
        return AccountUpdatingEvent.builder()
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

    private static UpdateAccountDetailsMessage getAccountDetails() {
        return UpdateAccountDetailsMessage.builder()
            .accountType(AccountType.MARITIME_OPERATOR_HOLDING_ACCOUNT.name())
            .registryId(REGISTRY_ID)
            .monitoringPlanId(EMP_ID)
            .firstYearOfVerifiedEmissions(NOW.getYear())
            .accountName("accountName")
            .companyImoNumber(IMO_NUMBER)
            .build();
    }

    private Map<String, String> getEventFields() {
        Map<String, String> fields = new LinkedHashMap<>();

        fields.put(PayloadFieldsUtils.ACCOUNT_TYPE, AccountType.MARITIME_OPERATOR_HOLDING_ACCOUNT.name());
        fields.put(PayloadFieldsUtils.REGISTRY_ID, REGISTRY_ID);
        fields.put(PayloadFieldsUtils.ACCOUNT_NAME, "accountName");
        fields.put(PayloadFieldsUtils.EMP_ID, EMP_ID);
        fields.put(PayloadFieldsUtils.IMO_NUMBER, IMO_NUMBER);
        fields.put(PayloadFieldsUtils.FIRST_YEAR_OF_VERIFIED_EMISSIONS, String.valueOf(NOW.getYear()));

        fields.put(PayloadFieldsUtils.ACCOUNT_HOLDER_TYPE, "accountHolderType");
        fields.put(PayloadFieldsUtils.ACCOUNT_HOLDER_NAME, "accountHolderName");
        fields.put(PayloadFieldsUtils.ADDRESS_LINE_1, "line1");
        fields.put(PayloadFieldsUtils.ADDRESS_LINE_2, "line2");
        fields.put(PayloadFieldsUtils.CITY, "city");
        fields.put(PayloadFieldsUtils.STATE, "state");
        fields.put(PayloadFieldsUtils.COUNTRY, "GR");
        fields.put(PayloadFieldsUtils.POSTCODE, "postcode");
        fields.put(PayloadFieldsUtils.CRN_NOT_EXIST, String.valueOf(true));
        fields.put(PayloadFieldsUtils.CRN, "companyRegistrationNumber");
        fields.put(PayloadFieldsUtils.CRN_JUSTIFICATION, "crnJustification");

        return fields;
    }
}