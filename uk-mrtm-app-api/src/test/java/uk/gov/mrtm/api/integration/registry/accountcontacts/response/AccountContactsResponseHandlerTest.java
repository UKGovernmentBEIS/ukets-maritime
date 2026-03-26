package uk.gov.mrtm.api.integration.registry.accountcontacts.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailService;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailServiceParams;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;
import uk.gov.netz.integration.model.metscontacts.MetsContactsEvent;
import uk.gov.netz.integration.model.metscontacts.MetsContactsEventOutcome;
import uk.gov.netz.integration.model.metscontacts.MetsContactsMessage;

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
class AccountContactsResponseHandlerTest {

    private static final String CORRELATION_ID = UUID.randomUUID().toString();
    private static final String REGISTRY_ID = "1234567";

    @InjectMocks
    private AccountContactsResponseHandler service;

    @Mock
    private MrtmAccountQueryService accountQueryService;
    @Mock
    private NotifyRegistryEmailService notifyRegistryEmailService;
    @Mock
    private RegistryIntegrationEmailProperties emailProperties;

    @Test
    void handleResponse_success() {
        MetsContactsEventOutcome event = MetsContactsEventOutcome.builder()
            .outcome(IntegrationEventOutcome.SUCCESS)
            .event(MetsContactsEvent.builder()
                .operatorId(REGISTRY_ID)
                .build())
            .build();

        service.handleResponse(event, CORRELATION_ID);

        verifyNoInteractions(accountQueryService,  notifyRegistryEmailService, emailProperties);
    }

    @Test
    void handleResponse_error_with_empty_list() {
        MetsContactsEventOutcome event = MetsContactsEventOutcome.builder()
            .outcome(IntegrationEventOutcome.ERROR)
            .errors(new ArrayList<>())
            .event(MetsContactsEvent.builder()
                .operatorId(REGISTRY_ID)
                .build())
            .build();

        service.handleResponse(event, CORRELATION_ID);

        verifyNoInteractions(accountQueryService,  notifyRegistryEmailService, emailProperties);
    }

    @Test
    void handleResponse_error_with_non_empty_list() {
        List<IntegrationEventErrorDetails> actionErrors = List.of(
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0703).build()
        );
        List<IntegrationEventErrorDetails> infoErrors = List.of(
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0701).build(),
            IntegrationEventErrorDetails.builder().error(IntegrationEventError.ERROR_0702).build()
        );

        List<IntegrationEventErrorDetails> allErrors = new ArrayList<>();
        allErrors.addAll(actionErrors);
        allErrors.addAll(infoErrors);

        MetsContactsEventOutcome event = MetsContactsEventOutcome.builder()
            .outcome(IntegrationEventOutcome.ERROR)
            .errors(allErrors)
            .event(getAccountContactsEvent())
            .build();

        MrtmAccount account = MrtmAccount.builder()
            .businessId("businessId")
            .name("accountName")
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .build();
        NotifyRegistryEmailServiceParams infoEmailParams = NotifyRegistryEmailServiceParams.builder()
            .account(account)
            .emitterId("businessId")
            .correlationId(CORRELATION_ID)
            .errorsForMail(infoErrors)
            .recipient("test-email@example.com")
            .isFordway(false)
            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_INFO_TEMPLATE)
            .integrationPoint("Account contacts")
            .fields(getEventFields())
            .build();
        NotifyRegistryEmailServiceParams actionEmailParams = NotifyRegistryEmailServiceParams.builder()
            .account(account)
            .emitterId("businessId")
            .correlationId(CORRELATION_ID)
            .errorsForMail(actionErrors)
            .recipient("test-email@example.com")
            .isFordway(false)
            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE)
            .integrationPoint("Account contacts")
            .fields(getEventFields())
            .build();

        when(accountQueryService.getAccountByRegistryId(Integer.valueOf(REGISTRY_ID))).thenReturn(account);
        when(emailProperties.getEmail()).thenReturn(Map.of(CompetentAuthorityEnum.ENGLAND.getCode(), "test-email@example.com"));

        service.handleResponse(event, CORRELATION_ID);

        verify(accountQueryService).getAccountByRegistryId(Integer.valueOf(REGISTRY_ID));
        verify(emailProperties).getEmail();
        verify(notifyRegistryEmailService).notifyRegulator(actionEmailParams);
        verify(notifyRegistryEmailService).notifyRegulator(infoEmailParams);

        verifyNoMoreInteractions(accountQueryService,  notifyRegistryEmailService, emailProperties);
    }

    private MetsContactsEvent getAccountContactsEvent() {
        return MetsContactsEvent.builder()
            .operatorId(REGISTRY_ID)
            .details(getDetails())
            .build();
    }

    private static List<MetsContactsMessage> getDetails() {
        return List.of(
            MetsContactsMessage.builder()
                .firstName("firstName1")
                .lastName("lastName1")
                .telephoneCountryCode("telephoneCountryCode1")
                .telephoneNumber("telephoneNumber1")
                .mobilePhoneCountryCode("mobilePhoneCountryCode1")
                .mobileNumber("mobileNumber1")
                .email("email1")
                .userType("userType1")
                .contactTypes(List.of("SERVICE1", "PRIMARY1"))
                .build(),
            MetsContactsMessage.builder()
                .firstName("firstName2")
                .lastName("lastName2")
                .telephoneCountryCode("telephoneCountryCode2")
                .telephoneNumber("telephoneNumber2")
                .mobilePhoneCountryCode("mobilePhoneCountryCode2")
                .mobileNumber("mobileNumber2")
                .email("email2")
                .userType("userType2")
                .contactTypes(List.of("SERVICE2", "PRIMARY2"))
                .build());
    }

    private Map<String, String> getEventFields() {
        Map<String, String> fields = new LinkedHashMap<>();

        fields.put(PayloadFieldsUtils.OPERATOR_ID, asStringOrEmpty(REGISTRY_ID) + "\r\n");

        Map<String, String> operator1Fields = new LinkedHashMap<>();
        operator1Fields.put(MrtmEmailNotificationTemplateConstants.FIRST_NAME, "firstName1");
        operator1Fields.put(MrtmEmailNotificationTemplateConstants.LAST_NAME, "lastName1");
        operator1Fields.put(MrtmEmailNotificationTemplateConstants.TELEPHONE_COUNTRY_CODE, "telephoneCountryCode1");
        operator1Fields.put(MrtmEmailNotificationTemplateConstants.TELEPHONE_NUMBER, "telephoneNumber1");
        operator1Fields.put(MrtmEmailNotificationTemplateConstants.MOBILE_PHONE_COUNTRY_CODE, "mobilePhoneCountryCode1");
        operator1Fields.put(MrtmEmailNotificationTemplateConstants.MOBILE_NUMBER, "mobileNumber1");
        operator1Fields.put(MrtmEmailNotificationTemplateConstants.USER_TYPE, "userType1");
        operator1Fields.put(MrtmEmailNotificationTemplateConstants.CONTACT_TYPES, List.of("SERVICE1", "PRIMARY1").toString());
        fields.put("email1", operator1Fields.toString());

        Map<String, String> operator2Fields = new LinkedHashMap<>();
        operator2Fields.put(MrtmEmailNotificationTemplateConstants.FIRST_NAME, "firstName2");
        operator2Fields.put(MrtmEmailNotificationTemplateConstants.LAST_NAME, "lastName2");
        operator2Fields.put(MrtmEmailNotificationTemplateConstants.TELEPHONE_COUNTRY_CODE, "telephoneCountryCode2");
        operator2Fields.put(MrtmEmailNotificationTemplateConstants.TELEPHONE_NUMBER, "telephoneNumber2");
        operator2Fields.put(MrtmEmailNotificationTemplateConstants.MOBILE_PHONE_COUNTRY_CODE, "mobilePhoneCountryCode2");
        operator2Fields.put(MrtmEmailNotificationTemplateConstants.MOBILE_NUMBER, "mobileNumber2");
        operator2Fields.put(MrtmEmailNotificationTemplateConstants.USER_TYPE, "userType2");
        operator2Fields.put(MrtmEmailNotificationTemplateConstants.CONTACT_TYPES, List.of("SERVICE2", "PRIMARY2").toString());
        fields.put("email2", operator2Fields.toString());


        return fields;
    }
}