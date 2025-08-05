package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.service.MrtmAccountUpdateService;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class EmpVariationUpdateEmpService {

    private final RequestService requestService;
    private final EmissionsMonitoringPlanQueryService empService;
    private final MrtmAccountUpdateService mrtmAccountUpdateService;

    private static final EmpVariationMapper EMP_VARIATION_MAPPER = Mappers.getMapper(EmpVariationMapper.class);

    @Transactional
    public void updateEmp(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();
        final Long accountId = request.getAccountId();

        final EmissionsMonitoringPlanContainer empContainer =
                EMP_VARIATION_MAPPER.toEmissionsMonitoringPlanContainer(
                        requestPayload);

        empService.updateEmissionsMonitoringPlan(accountId, empContainer);
        final EmpOperatorDetails empOperatorDetails = empContainer.getEmissionsMonitoringPlan().getOperatorDetails();

        mrtmAccountUpdateService.updateAccountUponEmpVariationApproved(
                accountId,
                empOperatorDetails.getOperatorName(),
                empOperatorDetails.getContactAddress(),
                getContactLocationFromEmp(empOperatorDetails)
        );
    }

    private AddressStateDTO getContactLocationFromEmp(EmpOperatorDetails empOperatorDetails) {
        OrganisationStructure organisationStructure = empOperatorDetails.getOrganisationStructure();

        return organisationStructure.getRegisteredAddress();
    }
}
