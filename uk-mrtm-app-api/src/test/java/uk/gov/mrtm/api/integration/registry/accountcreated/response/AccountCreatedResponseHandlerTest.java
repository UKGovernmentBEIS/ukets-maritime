package uk.gov.mrtm.api.integration.registry.accountcreated.response;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.account.AccountDetailsMessage;
import uk.gov.netz.integration.model.account.AccountHolderMessage;
import uk.gov.netz.integration.model.account.AccountOpeningEvent;
import uk.gov.netz.integration.model.account.AccountOpeningEventOutcome;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountCreatedResponseHandlerTest {

    private static final String TEST_CORRELATION_ID = "test-correlation-id";

    @InjectMocks
    private AccountCreatedResponseHandler handler;

    @Mock
    private NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;

    @Mock
    private RegistryIntegrationEmailProperties emailProperties;

    @Mock
    private MrtmAccountRepository accountRepository;

    @Captor
    private ArgumentCaptor<EmailData<EmailNotificationTemplateData>> emailDataArgumentCaptor;

    @Test
    void handleResponse_success() {
        AccountOpeningEventOutcome event = AccountOpeningEventOutcome.builder()
                .event(
                    AccountOpeningEvent.builder()
                        .accountDetails(
                            AccountDetailsMessage
                                .builder()
                                .emitterId("Uk")
                                .build()
                        )
                        .build()
                )
                .outcome(IntegrationEventOutcome.SUCCESS).build();
        handler.handleResponse(event, TEST_CORRELATION_ID);
        verify(notificationEmailService, never()).notifyRecipient(any(), any());
    }

    @Test
    void handleResponse_action_info_errors() {
        String imoNumber = "0000000";
        AccountOpeningEventOutcome event = AccountOpeningEventOutcome.builder()
                .event(AccountOpeningEvent.builder()
                        .accountDetails(AccountDetailsMessage.builder()
                                .companyImoNumber(imoNumber)
                                .build())
                        .accountHolder(AccountHolderMessage.builder().build())
                        .build())
                .outcome(IntegrationEventOutcome.ERROR)
                .errors(List.of(createEventErrorDetails(IntegrationEventError.ERROR_0106, "0106 error message"),
                        createEventErrorDetails(IntegrationEventError.ERROR_0104, "0104 error message")))
                .build();

        when(emailProperties.getEmail()).thenReturn(Map.of(CompetentAuthorityEnum.ENGLAND.getCode(), "test-email@example.com"));
        when(accountRepository.findByImoNumber(imoNumber)).thenReturn(Optional.of(MrtmAccount.builder()
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .build()));

        handler.handleResponse(event, TEST_CORRELATION_ID);
        verify(notificationEmailService, times(2)).notifyRecipient(any(EmailData.class), eq("test-email@example.com"));
        verify(emailProperties, times(2)).getEmail();
    }

    @Test
    void handleResponse_only_action_errors() {
        String imoNumber = "0000000";
        AccountOpeningEventOutcome event = AccountOpeningEventOutcome.builder()
                .event(AccountOpeningEvent.builder()
                        .accountDetails(AccountDetailsMessage.builder()
                                .companyImoNumber(imoNumber)
                                .regulator("EA")
                                .build())
                        .accountHolder(AccountHolderMessage.builder().build())
                        .build())
                .outcome(IntegrationEventOutcome.ERROR)
                .errors(List.of(createEventErrorDetails(IntegrationEventError.ERROR_0106, "0106 error message")))
                .build();

        when(emailProperties.getEmail()).thenReturn(Map.of(CompetentAuthorityEnum.SCOTLAND.getCode(), "test-email@example.com"));
        when(accountRepository.findByImoNumber(imoNumber)).thenReturn(Optional.of(MrtmAccount.builder()
                .competentAuthority(CompetentAuthorityEnum.SCOTLAND)
                .build()));

        handler.handleResponse(event, TEST_CORRELATION_ID);
        verify(notificationEmailService).notifyRecipient(emailDataArgumentCaptor.capture(), eq("test-email@example.com"));
        verify(emailProperties).getEmail();

        final EmailData<EmailNotificationTemplateData> emailDataArgumentCaptured = emailDataArgumentCaptor.getValue();

        assertEquals(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE, emailDataArgumentCaptured.getNotificationTemplateData().getTemplateName());
        assertThat(emailDataArgumentCaptured.getNotificationTemplateData().getTemplateParams().keySet())
                .containsExactlyInAnyOrder(MrtmEmailNotificationTemplateConstants.EMITTER_ID,
                        MrtmEmailNotificationTemplateConstants.ERRORS,
                        MrtmEmailNotificationTemplateConstants.FIELDS,
                        MrtmEmailNotificationTemplateConstants.CORRELATION_ID,
                        MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM,
                        MrtmEmailNotificationTemplateConstants.OPERATOR_NAME,
                        MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT);

    }

    private IntegrationEventErrorDetails createEventErrorDetails(IntegrationEventError eventError, String errorMessage) {
        return IntegrationEventErrorDetails.builder()
                .error(eventError)
                .errorMessage(errorMessage)
                .build();
    }
}
