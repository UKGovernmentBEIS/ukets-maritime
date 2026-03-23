package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.config.RegistryConfig;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.event.EmpApprovedEvent;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
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

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.REQUEST_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;

@Service
@Log4j2
@RequiredArgsConstructor
public class EmpIssuanceOfficialNoticeService {

    private final RequestService requestService;

    private final OfficialNoticeSendService officialNoticeSendService;

    private final DecisionNotificationUsersService decisionNotificationUsersService;

    private final RegistryConfig registryConfig;

    private final RequestAccountContactQueryService requestAccountContactQueryService;

    private final DocumentTemplateOfficialNoticeParamsProvider documentTemplateOfficialNoticeParamsProvider;

    private final FileDocumentGenerateServiceDelegator documentFileGeneratorService;

    private final ApplicationEventPublisher publisher;

    private final EmissionsMonitoringPlanQueryService empQueryService;

    private final EmpIssuanceSendRegistryAccountOpeningAddRequestActionService addRequestActionService;

    private final MrtmAccountQueryService accountQueryService;

    private static final String INTEGRATION_POINT_KEY = "Account Created";

    public void sendOfficialNotice(final String requestId, EmpIssuanceDeterminationType determinationType) {
        final Request request = requestService.findRequestById(requestId);
        final EmpIssuanceRequestPayload requestPayload = (EmpIssuanceRequestPayload) request.getPayload();
        final List<FileInfoDTO> attachments = requestPayload.getEmpDocument() != null ?
                List.of(requestPayload.getOfficialNotice(), requestPayload.getEmpDocument()) :
                List.of(requestPayload.getOfficialNotice());

        officialNoticeSendService.sendOfficialNotice(attachments, request,
                decisionNotificationUsersService.findUserEmails(requestPayload.getDecisionNotification()),
                List.of(registryConfig.getEmail()));

        if (EmpIssuanceDeterminationType.APPROVED.equals(determinationType)) {
            final MrtmAccount account = accountQueryService.getAccountById(request.getAccountId());

            if (!requestPayload.isAccountOpeningEventSentToRegistry() && ObjectUtils.isEmpty(account.getRegistryId())) {
                final EmissionsMonitoringPlanDTO emp = empQueryService
                    .getEmissionsMonitoringPlanDTOByAccountId(request.getAccountId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

                publisher.publishEvent(EmpApprovedEvent.builder()
                        .accountId(request.getAccountId())
                        .empId(emp.getId())
                        .emissionsMonitoringPlan(emp.getEmpContainer().getEmissionsMonitoringPlan())
                        .build());

                addRequestActionService.addRequestAction(
                    request,
                    emp.getEmpContainer().getEmissionsMonitoringPlan().getOperatorDetails().getOrganisationStructure(),
                    requestPayload.getRegulatorReviewer());

            } else {
                log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, request.getAccountId(),
                        INTEGRATION_POINT_KEY,
                        "Cannot send emissions to ETS Registry because manual push has already performed");
            }
        }
    }

    @Transactional
    public CompletableFuture<FileInfoDTO> generateGrantedOfficialNotice(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final EmpIssuanceRequestPayload requestPayload = (EmpIssuanceRequestPayload) request.getPayload();
        final UserInfoDTO accountPrimaryContact = requestAccountContactQueryService.getRequestAccountPrimaryContact(request)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND));
        final UserInfoDTO serviceContact = requestAccountContactQueryService.getRequestAccountServiceContact(request)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_SERVICE_CONTACT_NOT_FOUND));
        final List<String> ccRecipientsEmails = decisionNotificationUsersService.findUserEmails(requestPayload.getDecisionNotification());

        return generateOfficialNoticeAsync(request,
                accountPrimaryContact,
                serviceContact,
                ccRecipientsEmails,
                MrtmDocumentTemplateGenerationContextActionType.EMP_ISSUANCE_GRANTED,
                MrtmDocumentTemplateType.EMP_ISSUANCE_GRANTED,
                "emp_application_approved.pdf");
    }

    @Transactional
    public void generateAndSaveDeemedWithdrawnOfficialNotice(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final EmpIssuanceRequestPayload requestPayload = (EmpIssuanceRequestPayload) request.getPayload();

        final UserInfoDTO accountPrimaryContact = requestAccountContactQueryService.getRequestAccountPrimaryContact(request)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND));
        final UserInfoDTO serviceContact = requestAccountContactQueryService.getRequestAccountServiceContact(request)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_SERVICE_CONTACT_NOT_FOUND));
        final List<String> ccRecipientsEmails = decisionNotificationUsersService.findUserEmails(requestPayload.getDecisionNotification());

        final FileInfoDTO officialNotice = this.generateOfficialNotice(request,
                accountPrimaryContact,
                serviceContact,
                ccRecipientsEmails,
                MrtmDocumentTemplateGenerationContextActionType.EMP_ISSUANCE_DEEMED_WITHDRAWN,
                MrtmDocumentTemplateType.EMP_ISSUANCE_DEEMED_WITHDRAWN,
                "emp_application_withdrawn.pdf");

        requestPayload.setOfficialNotice(officialNotice);
    }

    private CompletableFuture<FileInfoDTO> generateOfficialNoticeAsync(final Request request,
                                                                       final UserInfoDTO accountPrimaryContact,
                                                                       final UserInfoDTO serviceContact,
                                                                       final List<String> ccRecipientsEmails,
                                                                       final String type,
                                                                       final String documentTemplateType,
                                                                       final String fileNameToGenerate) {
        final EmpIssuanceRequestPayload requestPayload = (EmpIssuanceRequestPayload) request.getPayload();

        final TemplateParams templateParams = constructTemplateParams(request, accountPrimaryContact,
                ccRecipientsEmails, type, requestPayload, serviceContact);
        return documentFileGeneratorService.generateAndSaveFileDocumentAsync(documentTemplateType, templateParams,
                fileNameToGenerate);
    }


    private TemplateParams constructTemplateParams(final Request request, final UserInfoDTO accountPrimaryContact,
                                                   final List<String> ccRecipientsEmails, final String type,
                                                   final EmpIssuanceRequestPayload requestPayload, final UserInfoDTO serviceContact) {
        return documentTemplateOfficialNoticeParamsProvider
                .constructTemplateParams(DocumentTemplateParamsSourceData.builder()
                        .contextActionType(type)
                        .request(request)
                        .signatory(requestPayload.getDecisionNotification().getSignatory())
                        .accountPrimaryContact(accountPrimaryContact)
                        .toRecipientEmail(serviceContact.getEmail())
                        .ccRecipientsEmails(ccRecipientsEmails).build());
    }

    private FileInfoDTO generateOfficialNotice(final Request request,
                                               final UserInfoDTO accountPrimaryContact,
                                               final UserInfoDTO serviceContact,
                                               final List<String> ccRecipientsEmails,
                                               final String type,
                                               final String documentTemplateType,
                                               final String fileNameToGenerate) {

        final EmpIssuanceRequestPayload requestPayload = (EmpIssuanceRequestPayload) request.getPayload();

        final TemplateParams templateParams = constructTemplateParams(request, accountPrimaryContact,
                ccRecipientsEmails, type, requestPayload, serviceContact);
        return documentFileGeneratorService.generateAndSaveFileDocument(documentTemplateType, templateParams, fileNameToGenerate);
    }

}
