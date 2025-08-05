package uk.gov.mrtm.api.integration.registry.emissionsupdated.request;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.ReportableEmissionsEntity;
import uk.gov.mrtm.api.reporting.domain.common.ReportableEmissionsUpdatedEvent;
import uk.gov.mrtm.api.reporting.repository.ReportableEmissionsRepository;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerRequestQueryService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEvent;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.capitalizeFirstLetter;

@ExtendWith(MockitoExtension.class)
class ReportableEmissionsNotifyRegistryServiceTest {
    private static final Long ACCOUNT_ID = 1L;
    private static final Year YEAR = Year.now();
    private static final String EMAIL = "email@email.com";
    private static final String EMITTER_ID = "MA12345";
    private static final String ACCOUNT_NAME = "Account Name";
    private static final String INTEGRATION_POINT_KEY = "Update emissions value";
    private static final int REGISTRY_ID = 1234567;

    @InjectMocks
    private ReportableEmissionsNotifyRegistryService service;

    @Mock
    private MrtmAccountQueryService accountQueryService;
    @Mock
    private DateService dateService;
    @Mock
    private AerRequestQueryService requestQueryService;
    @Mock
    private ReportableEmissionsSendToRegistryProducer reportableEmissionsSendToRegistryProducer;
    @Mock
    private KafkaTemplate<String, AccountEmissionsUpdateEvent> accountEmissionsUpdateEventKafkaTemplate;
    @Mock
    private ReportableEmissionsRepository reportableEmissionsRepository;
    @Mock
    private RegistryIntegrationEmailProperties emailProperties;
    @Mock
    private NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;

    @ParameterizedTest
    @ValueSource(booleans = {true, false})
    void notifyRegistry_is_exempt(boolean reportableEmissionsEntityExists) {
        ReportableEmissionsUpdatedEvent event = ReportableEmissionsUpdatedEvent.builder().accountId(ACCOUNT_ID).year(YEAR).build();
        MrtmAccount account = MrtmAccount.builder().build();
        ReportableEmissionsUpdatedSubmittedEventDetails expectedResponse = createResponse(false, null);

        when(accountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);
        when(reportableEmissionsRepository.findByAccountIdAndYear(ACCOUNT_ID, YEAR)).thenReturn(
            reportableEmissionsEntityExists
                ? Optional.of(ReportableEmissionsEntity.builder().isExempted(true).build())
                : Optional.empty()
        );

        ReportableEmissionsUpdatedSubmittedEventDetails actualResponse = service.notifyRegistry(event);

        assertEquals(expectedResponse, actualResponse);

        verify(accountQueryService).getAccountById(ACCOUNT_ID);
        verify(reportableEmissionsRepository).findByAccountIdAndYear(ACCOUNT_ID, YEAR);
        verifyNoMoreInteractions(accountQueryService, reportableEmissionsRepository);
        verifyNoInteractions(requestQueryService, reportableEmissionsSendToRegistryProducer,
            accountEmissionsUpdateEventKafkaTemplate, emailProperties, notificationEmailService);
    }

    @Test
    void notifyRegistry_registry_id_is_null() {
        ReportableEmissionsUpdatedEvent event = ReportableEmissionsUpdatedEvent.builder().accountId(ACCOUNT_ID).year(YEAR).build();
        MrtmAccount account = MrtmAccount.builder()
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .name(ACCOUNT_NAME)
            .businessId(EMITTER_ID)
            .build();
        ReportableEmissionsUpdatedSubmittedEventDetails expectedResponse = createResponse(false, null);

        when(accountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);
        when(reportableEmissionsRepository.findByAccountIdAndYear(ACCOUNT_ID, YEAR))
            .thenReturn(Optional.of(ReportableEmissionsEntity.builder().isExempted(false).build()));
        when(emailProperties.getEmail()).thenReturn(Map.of(CompetentAuthorityEnum.ENGLAND.getCode(), EMAIL));

        ReportableEmissionsUpdatedSubmittedEventDetails actualResponse = service.notifyRegistry(event);

        assertEquals(expectedResponse, actualResponse);

        verify(accountQueryService).getAccountById(ACCOUNT_ID);
        verify(reportableEmissionsRepository).findByAccountIdAndYear(ACCOUNT_ID, YEAR);
        verify(notificationEmailService).notifyRecipient(getEmailData(), EMAIL);
        verifyNoMoreInteractions(accountQueryService, reportableEmissionsRepository,
            notificationEmailService, emailProperties);
        verifyNoInteractions(requestQueryService, reportableEmissionsSendToRegistryProducer,
            accountEmissionsUpdateEventKafkaTemplate);
    }

    @Test
    void notifyRegistry_is_from_doe() {
        BigDecimal reportableEmissionsDecimal = new BigDecimal("2.1");
        BigDecimal reportableEmissions = new BigDecimal("2");
        ReportableEmissionsUpdatedEvent event = ReportableEmissionsUpdatedEvent.builder()
            .accountId(ACCOUNT_ID)
            .isFromDoe(true)
            .year(YEAR)
            .reportableEmissions(reportableEmissionsDecimal)
            .build();
        MrtmAccount account = MrtmAccount.builder()
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .name(ACCOUNT_NAME)
            .businessId(EMITTER_ID)
            .registryId(REGISTRY_ID)
            .build();

        AccountEmissionsUpdateEvent accountEmissionsUpdatedRequestEvent = AccountEmissionsUpdateEvent.builder()
            .registryId(Long.valueOf(account.getRegistryId()))
            .reportableEmissions(reportableEmissions.longValue())
            .reportingYear(event.getYear()).build();
        ReportableEmissionsUpdatedSubmittedEventDetails expectedResponse = createResponse(true, accountEmissionsUpdatedRequestEvent);

        when(accountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);
        when(reportableEmissionsRepository.findByAccountIdAndYear(ACCOUNT_ID, YEAR))
            .thenReturn(Optional.of(ReportableEmissionsEntity.builder().isExempted(false).build()));

        ReportableEmissionsUpdatedSubmittedEventDetails actualResponse = service.notifyRegistry(event);

        assertEquals(expectedResponse, actualResponse);

        verify(reportableEmissionsSendToRegistryProducer).produce(accountEmissionsUpdatedRequestEvent, accountEmissionsUpdateEventKafkaTemplate);
        verify(accountQueryService).getAccountById(ACCOUNT_ID);
        verify(reportableEmissionsRepository).findByAccountIdAndYear(ACCOUNT_ID, YEAR);
        verifyNoMoreInteractions(accountQueryService, reportableEmissionsRepository,
            notificationEmailService, emailProperties, reportableEmissionsSendToRegistryProducer);
        verifyNoInteractions(requestQueryService, accountEmissionsUpdateEventKafkaTemplate,
            notificationEmailService, emailProperties);
    }

    @Test
    void notifyRegistry_is_from_aer_aer_not_exists() {
        BigDecimal reportableEmissionsDecimal = new BigDecimal("2.1");
        ReportableEmissionsUpdatedEvent event = ReportableEmissionsUpdatedEvent.builder()
            .accountId(ACCOUNT_ID)
            .isFromDoe(false)
            .year(YEAR)
            .reportableEmissions(reportableEmissionsDecimal)
            .build();
        MrtmAccount account = MrtmAccount.builder()
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .name(ACCOUNT_NAME)
            .businessId(EMITTER_ID)
            .registryId(REGISTRY_ID)
            .build();

        when(accountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);
        when(requestQueryService.findRequestByAccountAndTypeForYear(ACCOUNT_ID, YEAR)).thenReturn(Optional.empty());
        when(reportableEmissionsRepository.findByAccountIdAndYear(ACCOUNT_ID, YEAR))
            .thenReturn(Optional.of(ReportableEmissionsEntity.builder().isExempted(false).build()));

        BusinessException exception = assertThrows(BusinessException.class,
            () -> service.notifyRegistry(event));

        assertThat(exception.getErrorCode()).isEqualTo(MrtmErrorCode.INTEGRATION_REGISTRY_EMISSIONS_AER_NOT_FOUND);

        verify(accountQueryService).getAccountById(ACCOUNT_ID);
        verify(reportableEmissionsRepository).findByAccountIdAndYear(ACCOUNT_ID, YEAR);
        verify(requestQueryService).findRequestByAccountAndTypeForYear(ACCOUNT_ID, YEAR);
        verifyNoMoreInteractions(requestQueryService, accountQueryService, reportableEmissionsRepository,
            notificationEmailService, emailProperties, reportableEmissionsSendToRegistryProducer);
        verifyNoInteractions(accountEmissionsUpdateEventKafkaTemplate,
            notificationEmailService, emailProperties, reportableEmissionsSendToRegistryProducer);
    }

    @ParameterizedTest
    @MethodSource("aerConditionsNotSatisfiedScenarios")
    void notifyRegistry_is_from_aer_conditions_are_not_satisfied(boolean isVerificationPerformed,
                                                                 boolean isFromRegulator,
                                                                 LocalDate now) {
        BigDecimal reportableEmissionsDecimal = new BigDecimal("2.1");
        ReportableEmissionsUpdatedEvent event = ReportableEmissionsUpdatedEvent.builder()
            .accountId(ACCOUNT_ID)
            .isFromDoe(false)
            .isFromRegulator(isFromRegulator)
            .year(YEAR)
            .reportableEmissions(reportableEmissionsDecimal)
            .build();
        MrtmAccount account = MrtmAccount.builder()
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .name(ACCOUNT_NAME)
            .businessId(EMITTER_ID)
            .registryId(REGISTRY_ID)
            .build();
        Request request = Request.builder()
            .payload(AerRequestPayload.builder().verificationPerformed(isVerificationPerformed).build())
            .build();
        ReportableEmissionsUpdatedSubmittedEventDetails expectedResponse = createResponse(false, null);

        lenient().when(dateService.getLocalDate()).thenReturn(now);
        when(accountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);
        when(requestQueryService.findRequestByAccountAndTypeForYear(ACCOUNT_ID, YEAR)).thenReturn(Optional.of(request));
        when(reportableEmissionsRepository.findByAccountIdAndYear(ACCOUNT_ID, YEAR))
            .thenReturn(Optional.of(ReportableEmissionsEntity.builder().isExempted(false).build()));

        ReportableEmissionsUpdatedSubmittedEventDetails actualResponse = service.notifyRegistry(event);

        assertEquals(expectedResponse, actualResponse);

        verify(accountQueryService).getAccountById(ACCOUNT_ID);
        verify(reportableEmissionsRepository).findByAccountIdAndYear(ACCOUNT_ID, YEAR);
        verify(requestQueryService).findRequestByAccountAndTypeForYear(ACCOUNT_ID, YEAR);
        verifyNoMoreInteractions(requestQueryService, accountQueryService, reportableEmissionsRepository,
            notificationEmailService, emailProperties, reportableEmissionsSendToRegistryProducer);
        verifyNoInteractions(accountEmissionsUpdateEventKafkaTemplate,
            notificationEmailService, emailProperties, reportableEmissionsSendToRegistryProducer);
    }

    public static Stream<Arguments> aerConditionsNotSatisfiedScenarios() {
        return Stream.of(
            Arguments.of(false, true, null),
            Arguments.of(true, true, null),
            Arguments.of(true, false, LocalDate.of(YEAR.plusYears(1).getValue(), 5, 1)),
            Arguments.of(true, false, LocalDate.of(YEAR.getValue(), 12, 31))
        );
    }

    @ParameterizedTest
    @MethodSource("reportingPeriodValidScenarios")
    void notifyRegistry_is_from_aer(LocalDate now) {
        BigDecimal reportableEmissionsDecimal = new BigDecimal("2.9");
        BigDecimal reportableEmissions = new BigDecimal("3");
        ReportableEmissionsUpdatedEvent event = ReportableEmissionsUpdatedEvent.builder()
            .accountId(ACCOUNT_ID)
            .isFromDoe(false)
            .year(YEAR)
            .reportableEmissions(reportableEmissionsDecimal)
            .build();
        MrtmAccount account = MrtmAccount.builder()
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .name(ACCOUNT_NAME)
            .businessId(EMITTER_ID)
            .registryId(REGISTRY_ID)
            .build();
        Request request = Request.builder()
            .payload(AerRequestPayload.builder().verificationPerformed(true).build())
            .build();
        AccountEmissionsUpdateEvent accountEmissionsUpdatedRequestEvent = AccountEmissionsUpdateEvent.builder()
            .registryId(Long.valueOf(account.getRegistryId()))
            .reportableEmissions(reportableEmissions.longValue())
            .reportingYear(event.getYear()).build();
        ReportableEmissionsUpdatedSubmittedEventDetails expectedResponse = createResponse(true, accountEmissionsUpdatedRequestEvent);


        when(dateService.getLocalDate()).thenReturn(now);
        when(accountQueryService.getAccountById(ACCOUNT_ID)).thenReturn(account);
        when(requestQueryService.findRequestByAccountAndTypeForYear(ACCOUNT_ID, YEAR)).thenReturn(Optional.of(request));
        when(reportableEmissionsRepository.findByAccountIdAndYear(ACCOUNT_ID, YEAR))
            .thenReturn(Optional.of(ReportableEmissionsEntity.builder().isExempted(false).build()));

        ReportableEmissionsUpdatedSubmittedEventDetails actualResponse = service.notifyRegistry(event);

        assertEquals(expectedResponse, actualResponse);

        verify(reportableEmissionsSendToRegistryProducer).produce(accountEmissionsUpdatedRequestEvent, accountEmissionsUpdateEventKafkaTemplate);
        verify(accountQueryService).getAccountById(ACCOUNT_ID);
        verify(reportableEmissionsRepository).findByAccountIdAndYear(ACCOUNT_ID, YEAR);
        verify(requestQueryService).findRequestByAccountAndTypeForYear(ACCOUNT_ID, YEAR);
        verifyNoMoreInteractions(requestQueryService, accountQueryService, reportableEmissionsRepository,
            notificationEmailService, emailProperties, reportableEmissionsSendToRegistryProducer);
        verifyNoInteractions(accountEmissionsUpdateEventKafkaTemplate,
            notificationEmailService, emailProperties);
    }

    public static Stream<Arguments> reportingPeriodValidScenarios() {
        return Stream.of(
            Arguments.of(LocalDate.of(YEAR.plusYears(1).getValue(), 1, 1)),
            Arguments.of(LocalDate.of(YEAR.plusYears(1).getValue(), 2, 2)),
            Arguments.of(LocalDate.of(YEAR.plusYears(1).getValue(), 4, 30))
        );
    }

    private ReportableEmissionsUpdatedSubmittedEventDetails createResponse(boolean notifiedRegistry,
                                                                           AccountEmissionsUpdateEvent data) {
        return ReportableEmissionsUpdatedSubmittedEventDetails.builder()
            .notifiedRegistry(notifiedRegistry)
            .data(data)
            .build();
    }

    private EmailData<EmailNotificationTemplateData> getEmailData() {
        String noRegistryIdErrorMessage = "No Registry ID exists in METS account";
        IntegrationEventErrorDetails integrationEventErrorDetails = IntegrationEventErrorDetails.builder()
            .error(IntegrationEventError.ERROR_0801)
            .errorMessage(noRegistryIdErrorMessage)
            .build();

        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(MrtmEmailNotificationTemplateConstants.EMITTER_ID, EMITTER_ID);
        templateParams.put(MrtmEmailNotificationTemplateConstants.ERRORS, List.of(integrationEventErrorDetails));
        templateParams.put(MrtmEmailNotificationTemplateConstants.CORRELATION_ID, PayloadFieldsUtils.EMPTY);
        templateParams.put(MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM, capitalizeFirstLetter(SERVICE_KEY));
        templateParams.put(MrtmEmailNotificationTemplateConstants.OPERATOR_NAME, ACCOUNT_NAME);
        templateParams.put(MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT, INTEGRATION_POINT_KEY);

        final EmailData<EmailNotificationTemplateData> emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE)
                .templateParams(templateParams)
                .build())
            .build();
        return emailData;
    }
}