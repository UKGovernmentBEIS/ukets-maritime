package uk.gov.mrtm.api.emissionsmonitoringplan.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.emissionsmonitoringplan.repository.EmissionsMonitoringPlanRepository;
import uk.gov.netz.api.common.exception.BusinessException;

import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class EmissionsMonitoringPlanService {

    private final EmissionsMonitoringPlanRepository emissionsMonitoringPlanRepository;


    @Transactional
    public void setFileDocumentUuid(final String empId, final String fileDocumentUuid) {
        emissionsMonitoringPlanRepository.updateFileDocumentUuid(empId, fileDocumentUuid);
    }

    @Transactional
    public int incrementEmpConsolidationNumber(Long accountId) {
        EmissionsMonitoringPlanEntity empEntity = emissionsMonitoringPlanRepository.findByAccountId(accountId)
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));
        return doIncrementEmpConsolidationNumber(empEntity);
    }

    private int doIncrementEmpConsolidationNumber(EmissionsMonitoringPlanEntity empEntity) {
        int consolidationNumber = empEntity.getConsolidationNumber() + 1;
        empEntity.setConsolidationNumber(consolidationNumber);
        return consolidationNumber;
    }
}
