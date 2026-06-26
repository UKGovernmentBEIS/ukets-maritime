package uk.gov.mrtm.api.integration.external.emp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.integration.external.emp.domain.ExternalEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.ExternalEmissionsMonitoringPlanDetails;
import uk.gov.mrtm.api.integration.external.emp.transform.ExternalEmpMapper;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.repository.RequestCustomRepository;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import static uk.gov.mrtm.api.common.exception.MrtmErrorCode.EMP_NOT_FOUND;
import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "feature-flag.external.integration.emp.view.enabled", havingValue = "true")
public class ExternalEmpViewService {

    private final ExternalEmpMapper mapper;
    private final MrtmAccountRepository mrtmAccountRepository;
    private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
    private final RequestCustomRepository requestCustomRepository;

    @Transactional
    public ExternalEmissionsMonitoringPlanDetails getLatestEmissionsMonitoringPlanData(String companyImoNumber) {
        MrtmAccount account = mrtmAccountRepository
            .findByImoNumber(companyImoNumber)
            .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        Optional<EmissionsMonitoringPlanDTO> empDTOOptional =
            emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanDTOByAccountId(account.getId());

        if (empDTOOptional.isEmpty()) {
            throw new BusinessException(EMP_NOT_FOUND);
        }

        EmissionsMonitoringPlanDTO empDTO = empDTOOptional.get();

        ExternalEmissionsMonitoringPlan data = mapper
            .toExternalEmissionsMonitoringPlan(empDTO.getEmpContainer().getEmissionsMonitoringPlan());

        Request latestRequest = requestCustomRepository.findLatestByRequestTypesAndResourceAndStatus(
            Set.of(MrtmRequestType.EMP_ISSUANCE, MrtmRequestType.EMP_REISSUE, MrtmRequestType.EMP_VARIATION),
            ResourceType.ACCOUNT, account.getId().toString(),
            Set.of(EmpIssuanceDeterminationType.APPROVED.name(), RequestStatuses.COMPLETED));

        String comments = getComments(latestRequest);

        return ExternalEmissionsMonitoringPlanDetails.builder()
            .submissionDate(resolveSubmissionDate(latestRequest))
            .version(empDTO.getConsolidationNumber())
            .comments(comments)
            .empData(data)
            .build();
    }

    private LocalDateTime resolveSubmissionDate(Request request) {
        if (isRegulatorLedEmpVariation(request)) {
            return request.getSubmissionDate();
        }
        return request.getEndDate();
    }

    private boolean isRegulatorLedEmpVariation(Request request) {
        return MrtmRequestType.EMP_VARIATION.equals(request.getType().getCode())
                && RoleTypeConstants.REGULATOR.equals(((EmpVariationRequestMetadata) request.getMetadata()).getInitiatorRoleType());
    }

    private String getComments(Request latestRequest) {
        return switch (latestRequest.getType().getCode()) {
            case MrtmRequestType.EMP_VARIATION ->
                ((EmpVariationRequestMetadata) latestRequest.getMetadata()).getSummary();
            case MrtmRequestType.EMP_REISSUE ->
                ((EmpReissueRequestMetadata) latestRequest.getMetadata()).getSummary();
            default -> null;
        };
    }
}
