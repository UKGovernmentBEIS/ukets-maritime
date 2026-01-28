package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.AccountUpdatedRegistryEvent;
import uk.gov.mrtm.api.integration.registry.accountupdated.domain.AccountUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.integration.registry.accountupdated.request.MaritimeAccountUpdatedEventListenerResolver;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.registry.service.AccountUpdatedEventAddRequestActionService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.service.DecisionNotificationUsersService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateOfficialNoticeParamsProvider;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateParamsSourceData;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.OfficialNoticeSendService;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class EmpVariationOfficialNoticeService {

    private final RequestService requestService;
    private final AccountUpdatedEventAddRequestActionService accountUpdatedEventRequestActionService;
    private final RequestAccountContactQueryService requestAccountContactQueryService;
    private final DecisionNotificationUsersService decisionNotificationUsersService;
    private final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;
    private final DocumentTemplateOfficialNoticeParamsProvider documentTemplateOfficialNoticeParamsProvider;
    private final OfficialNoticeSendService officialNoticeSendService;
    private final MaritimeAccountUpdatedEventListenerResolver accountUpdatedRegistryListener;

    @Transactional
    public CompletableFuture<FileInfoDTO> generateApprovedOfficialNotice(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();
        final UserInfoDTO accountPrimaryContact = requestAccountContactQueryService.getRequestAccountPrimaryContact(request)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND));
        final List<String> ccRecipientsEmails = decisionNotificationUsersService.findUserEmails(requestPayload.getDecisionNotification());
        final UserInfoDTO serviceContact = requestAccountContactQueryService.getRequestAccountServiceContact(request)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_SERVICE_CONTACT_NOT_FOUND));

        return generateOfficialNoticeAsync(request,
            accountPrimaryContact,
            serviceContact,
            ccRecipientsEmails,
            MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_ACCEPTED,
            MrtmDocumentTemplateType.EMP_VARIATION_ACCEPTED
        );
    }

    @Transactional
    public CompletableFuture<FileInfoDTO> generateApprovedOfficialNoticeRegulatorLed(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();
        final UserInfoDTO accountPrimaryContact = requestAccountContactQueryService.getRequestAccountPrimaryContact(request)
            .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND));
        final List<String> ccRecipientsEmails = decisionNotificationUsersService.findUserEmails(requestPayload.getDecisionNotification());
        final UserInfoDTO serviceContact = requestAccountContactQueryService.getRequestAccountServiceContact(request)
            .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_SERVICE_CONTACT_NOT_FOUND));

        return generateOfficialNoticeAsync(request,
            accountPrimaryContact,
            serviceContact,
            ccRecipientsEmails,
            MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_REGULATOR_LED_APPROVED,
            MrtmDocumentTemplateType.EMP_VARIATION_REGULATOR_LED_APPROVED);
    }

    public void sendOfficialNotice(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();
        final List<String> ccRecipientsEmails = decisionNotificationUsersService.findUserEmails(requestPayload.getDecisionNotification());
        final List<FileInfoDTO> attachments = requestPayload.getEmpDocument() != null ?
            List.of(requestPayload.getOfficialNotice(), requestPayload.getEmpDocument()) :
            List.of(requestPayload.getOfficialNotice());
        officialNoticeSendService.sendOfficialNotice(attachments, request, ccRecipientsEmails);

        AccountUpdatedSubmittedEventDetails updatedSubmittedEventDetails = accountUpdatedRegistryListener.onAccountUpdatedEvent(AccountUpdatedRegistryEvent.builder()
            .accountId(request.getAccountId())
            .emissionsMonitoringPlan(requestPayload.getEmissionsMonitoringPlan())
            .build());

        accountUpdatedEventRequestActionService.addRequestAction(
            request,
            updatedSubmittedEventDetails,
            requestPayload.getEmissionsMonitoringPlan().getOperatorDetails().getOrganisationStructure(),
            null);
    }

    @Transactional
    public void generateAndSaveRejectedOfficialNotice(final String requestId) {
        generateAndSaveOfficialNotice(requestId, MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_REJECTED,
                MrtmDocumentTemplateType.EMP_VARIATION_REJECTED, "emp_variation_rejected.pdf");
    }

    @Transactional
    public void generateAndSaveDeemedWithdrawnOfficialNotice(final String requestId) {
        generateAndSaveOfficialNotice(requestId, MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_DEEMED_WITHDRAWN,
                MrtmDocumentTemplateType.EMP_VARIATION_DEEMED_WITHDRAWN, "emp_variation_withdrawn.pdf");
    }

    private void generateAndSaveOfficialNotice(final String requestId,
                                              final String contextActionType,
                                              final String documentTemplateType,
                                              final String fileNameToGenerate) {
        final Request request = requestService.findRequestById(requestId);
        final EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();

        final UserInfoDTO accountPrimaryContact = requestAccountContactQueryService.getRequestAccountPrimaryContact(request)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND));
        final UserInfoDTO serviceContact = requestAccountContactQueryService.getRequestAccountServiceContact(request)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_SERVICE_CONTACT_NOT_FOUND));
        final List<String> ccRecipientsEmails = decisionNotificationUsersService.findUserEmails(requestPayload.getDecisionNotification());

        final FileInfoDTO officialNotice = generateOfficialNotice(request,
                accountPrimaryContact,
                serviceContact,
                ccRecipientsEmails,
                contextActionType,
                documentTemplateType,
                fileNameToGenerate);

        requestPayload.setOfficialNotice(officialNotice);
    }

    private CompletableFuture<FileInfoDTO> generateOfficialNoticeAsync(final Request request,
                                                                       final UserInfoDTO accountPrimaryContact,
                                                                       final UserInfoDTO serviceContact,
                                                                       final List<String> ccRecipientsEmails,
                                                                       String mrtmDocumentTemplateGenerationContextActionType,
                                                                       String mrtmDocumentTemplateType) {

        final TemplateParams templateParams = buildTemplateParams(request, accountPrimaryContact,
                serviceContact, ccRecipientsEmails, mrtmDocumentTemplateGenerationContextActionType);
        return fileDocumentGenerateServiceDelegator.generateAndSaveFileDocumentAsync(mrtmDocumentTemplateType, templateParams,
                "emp_variation_approved.pdf");
    }

    private FileInfoDTO generateOfficialNotice(final Request request,
                                               final UserInfoDTO accountPrimaryContact,
                                               final UserInfoDTO serviceContact,
                                               final List<String> ccRecipientsEmails,
                                               final String type,
                                               final String documentTemplateType,
                                               final String fileNameToGenerate) {
        final TemplateParams templateParams = buildTemplateParams(request,
                accountPrimaryContact,
                serviceContact,
                ccRecipientsEmails,
                type);
        return fileDocumentGenerateServiceDelegator.generateAndSaveFileDocument(documentTemplateType, templateParams, fileNameToGenerate);
    }

    private TemplateParams buildTemplateParams(final Request request, final UserInfoDTO accountPrimaryContact,
                                               final UserInfoDTO serviceContact, final List<String> ccRecipientsEmails,
                                               String type) {
        final EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();

        return documentTemplateOfficialNoticeParamsProvider
                .constructTemplateParams(DocumentTemplateParamsSourceData.builder()
                        .contextActionType(type)
                        .request(request)
                        .signatory(requestPayload.getDecisionNotification().getSignatory())
                        .accountPrimaryContact(accountPrimaryContact)
                        .toRecipientEmail(serviceContact.getEmail())
                        .ccRecipientsEmails(ccRecipientsEmails).build());
    }
}
