package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.service.MrtmAccountUpdateService;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.LimitedCompanyOrganisation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationLegalStatusType;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmpVariationUpdateEmpServiceTest {

    @InjectMocks
    private EmpVariationUpdateEmpService service;

    @Mock
    private RequestService requestService;

    @Mock
    private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanService;

    @Mock
    private MrtmAccountUpdateService mrtmAccountUpdateService;

    @Test
    void updateEmp() {
        Long accountId = 1L;
        String requestId = "requestId";
        String operatorName = "name";
        AddressStateDTO contactAddress = AddressStateDTO.builder()
                .line1("addressLine")
                .state("state")
                .city("city")
                .country("country")
                .build();
        AddressStateDTO registeredAddress = AddressStateDTO.builder()
                .line1("line1")
                .state("state1")
                .city("city1")
                .country("country1")
                .build();
        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                        .operatorDetails(EmpOperatorDetails.builder()
                                .contactAddress(contactAddress)
                                .operatorName(operatorName)
                                .organisationStructure(LimitedCompanyOrganisation.builder()
                                        .legalStatusType(OrganisationLegalStatusType.LIMITED_COMPANY)
                                        .registeredAddress(registeredAddress)
                                        .build())
                                .build())
                        .build())
                .build();
        Request request = Request.builder()
                .id(requestId)
                .payload(requestPayload)
                .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        service.updateEmp(requestId);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(emissionsMonitoringPlanService, times(1))
                .updateEmissionsMonitoringPlan(eq(accountId), any(EmissionsMonitoringPlanContainer.class));
        verify(mrtmAccountUpdateService, times(1))
                .updateAccountUponEmpVariationApproved(accountId, operatorName, contactAddress, registeredAddress);
    }
}
