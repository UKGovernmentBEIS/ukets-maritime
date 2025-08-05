package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.EmissionsMonitoringPlanFactory;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationApplicationSubmitInitializerTest {

    @InjectMocks
    private EmpVariationApplicationSubmitInitializer handler;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Mock
    private EmissionsMonitoringPlanQueryService empQueryService;

    @Test
    void initializePayload() {
        String name = "new name";
        Long accountId = 1L;
        Request request = Request.builder().requestResources(List.of(RequestResource.builder()
            .resourceId(String.valueOf(accountId))
            .resourceType(ResourceType.ACCOUNT).build()))
            .build();
        String newLine1 = "new line1";
        String newCity = "new city";
        String newCountry = "new country";
        String newPostcode = "new postcode";

        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlanFactory.getEmissionsMonitoringPlan(UUID.randomUUID(), "1234567");
        EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer.builder().emissionsMonitoringPlan(emissionsMonitoringPlan).build();

        when(empQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId))
            .thenReturn(Optional.ofNullable(
                EmissionsMonitoringPlanDTO
                    .builder()
                    .empContainer(empContainer)
                    .build())
            );

        MrtmAccount accountInfo = MrtmAccount
            .builder()
            .imoNumber("1234567")
            .name(name)
            .address(AddressState.builder()
                .line1(newLine1)
                .city(newCity)
                .country(newCountry)
                .postcode(newPostcode)
                .build())
            .build();

        when(mrtmAccountQueryService.getAccountById(accountId)).thenReturn(accountInfo);

        RequestTaskPayload result = handler.initializePayload(request);

        emissionsMonitoringPlan.getOperatorDetails().setOperatorName(name);
        emissionsMonitoringPlan.getOperatorDetails().setContactAddress(AddressStateDTO.builder()
            .line1(newLine1)
            .city(newCity)
            .country(newCountry)
            .postcode(newPostcode)
            .build());

        EmpVariationApplicationSubmitRequestTaskPayload payload =
            (EmpVariationApplicationSubmitRequestTaskPayload) result;
        assertThat(payload.getPayloadType()).isEqualTo(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_SUBMIT_PAYLOAD);
        assertThat(payload.getEmissionsMonitoringPlan()).isEqualTo(emissionsMonitoringPlan);
        assertThat(payload.getEmpAttachments()).isEmpty();

        verify(mrtmAccountQueryService).getAccountById(accountId);
        verifyNoMoreInteractions(mrtmAccountQueryService);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(handler.getRequestTaskTypes()).containsExactlyInAnyOrder(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_SUBMIT
        );
    }

}