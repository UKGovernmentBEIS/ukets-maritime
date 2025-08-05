package uk.gov.mrtm.api.emissionsmonitoringplan.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.authorization.rules.services.authorityinfo.providers.EmpAuthorityInfoProvider;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpAccountDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpDetailsDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.repository.EmissionsMonitoringPlanRepository;
import uk.gov.mrtm.api.emissionsmonitoringplan.transform.EmissionsMonitoringPlanMapper;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.files.documents.service.FileDocumentService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.repository.RequestRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class EmissionsMonitoringPlanQueryService implements EmpAuthorityInfoProvider {

    private final EmissionsMonitoringPlanRepository emissionsMonitoringPlanRepository;
    private final FileDocumentService fileDocumentService;
    private final RequestRepository requestRepository;
    private final EmissionsMonitoringPlanIdentifierGenerator empIdentifierGenerator;
    private final EmpValidatorService empValidatorService;

    private static final EmissionsMonitoringPlanMapper EMISSIONS_MONITORING_PLAN_MAPPER = Mappers.getMapper(EmissionsMonitoringPlanMapper.class);


    @Transactional(readOnly = true)
    public Optional<EmpDetailsDTO> getEmissionsMonitoringPlanDetailsDTOByAccountId(Long accountId) {
        return emissionsMonitoringPlanRepository.findByAccountId(accountId).map(empEntity -> EMISSIONS_MONITORING_PLAN_MAPPER.toEmpDetailsDTO(empEntity,
                Optional.ofNullable(empEntity.getFileDocumentUuid()).map((fileDocumentService::getFileInfoDTO)).orElse(null)));
    }

    @Transactional(readOnly = true)
    public Optional<EmissionsMonitoringPlanDTO> getEmissionsMonitoringPlanDTOByAccountId(Long accountId) {
        return emissionsMonitoringPlanRepository.findByAccountId(accountId).map(EMISSIONS_MONITORING_PLAN_MAPPER::toEmissionsMonitoringPlanDTO);
    }

    public EmissionsMonitoringPlanContainer getEmpContainerById(String id) {
        return emissionsMonitoringPlanRepository.findById(id)
            .map(EmissionsMonitoringPlanEntity::getEmpContainer)
            .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    public boolean existsContainerByIdAndFileDocumentUuid(final String empId, final String fileDocumentUuid) {
        return emissionsMonitoringPlanRepository.existsByIdAndFileDocumentUuid(empId, fileDocumentUuid);
    }

    @Transactional(readOnly = true)
    public Request findApprovedByAccountId(Long accountId) {
        List<Request> requests = requestRepository.findByAccountIdAndTypeAndStatus(accountId, MrtmRequestType.EMP_ISSUANCE,
            EmpIssuanceDeterminationType.APPROVED.name());

        if (requests.size() != 1) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER);
        }

        return requests.getFirst();
    }

    public Optional<String> getEmpIdByAccountId(Long accountId) {
        return emissionsMonitoringPlanRepository.findIdByAccountId(accountId);
    }

    @Transactional
    public void submitEmissionsMonitoringPlan(Long accountId, EmissionsMonitoringPlanContainer empContainer) {
        empValidatorService.validateEmissionsMonitoringPlan(empContainer, accountId);

        String empId = empIdentifierGenerator.generate(accountId);

        //submit
        EmissionsMonitoringPlanEntity empEntity = EmissionsMonitoringPlanEntity.builder()
                .id(empId)
                .accountId(accountId)
                .empContainer(empContainer)
                .build();

        emissionsMonitoringPlanRepository.save(empEntity);
    }

    @Transactional
    public void updateEmissionsMonitoringPlan(Long accountId, EmissionsMonitoringPlanContainer empContainer) {
        // validate
        empValidatorService.validateEmissionsMonitoringPlan(empContainer, accountId);

        EmissionsMonitoringPlanEntity empEntity = emissionsMonitoringPlanRepository.findByAccountId(accountId)
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        // update emp
        empEntity.setEmpContainer(empContainer);
        doIncrementEmpConsolidationNumber(empEntity);
    }

    private void doIncrementEmpConsolidationNumber(EmissionsMonitoringPlanEntity empEntity) {
        empEntity.setConsolidationNumber(empEntity.getConsolidationNumber() + 1);
    }

    @Transactional(readOnly = true)
    public int getEmissionsMonitoringPlanConsolidationNumberByAccountId(Long accountId) {
        return emissionsMonitoringPlanRepository.findByAccountId(accountId)
                .map(EmissionsMonitoringPlanEntity::getConsolidationNumber)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    public Map<Long, EmpAccountDTO> getEmpAccountsByAccountIds(Set<Long> accountIds) {
        return emissionsMonitoringPlanRepository.findAllByAccountIdIn(accountIds).stream()
                .collect(Collectors.toMap(EmpAccountDTO::getAccountId, Function.identity()));
    }

    @Override
    public Long getEmpAccountById(String id) {
        return emissionsMonitoringPlanRepository.findEmpAccountById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }
}
