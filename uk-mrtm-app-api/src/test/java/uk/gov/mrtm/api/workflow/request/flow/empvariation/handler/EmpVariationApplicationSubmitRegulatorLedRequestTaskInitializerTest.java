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
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReason;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReasonType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmpVariationApplicationSubmitRegulatorLedRequestTaskInitializerTest {

    @InjectMocks
    private EmpVariationApplicationSubmitRegulatorLedRequestTaskInitializer cut;

    @Mock
    private EmissionsMonitoringPlanQueryService empQueryService;

    @Mock
    private MrtmAccountQueryService accountQueryService;

    @Test
    void initializePayload_not_already_determined() {
        Long accountId = 1L;
        String operatorName = "opName";
        String activityDesc = "testActivityDescription";



        AddressStateDTO contactAddress = AddressStateDTO.builder()
                .line1("line1")
                .state("state")
                .city("city")
                .country("country")
                .build();
        EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder()
                .abbreviations(EmpAbbreviations.builder().exist(false).build())
                .operatorDetails(EmpOperatorDetails.builder()
                        .activityDescription(activityDesc)
                        .operatorName(operatorName)
                        .contactAddress(contactAddress)
                        .build())
                .build();

        EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer.builder()
                .emissionsMonitoringPlan(emp)
                .build();
        EmissionsMonitoringPlanDTO empDto = EmissionsMonitoringPlanDTO
                .builder()
                .empContainer(empContainer)
                .build();

        AddressState addressState = AddressState.builder().line1("line1")
                .state("state")
                .city("city")
                .country("country")
                .build();
        MrtmAccount accountInfo = MrtmAccount.builder().name(operatorName).address(addressState).id(accountId).build();

        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder().originalEmpContainer(empContainer)
                .build();

        Request request = Request.builder().requestResources(List.of(RequestResource.builder()
            .resourceId(String.valueOf(accountId))
            .resourceType(ResourceType.ACCOUNT).build())).payload(requestPayload).build();

        when(empQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId)).thenReturn(Optional.of(empDto));
        when(accountQueryService.getAccountById(accountId)).thenReturn(accountInfo);

        RequestTaskPayload result = cut.initializePayload(request);

        verify(accountQueryService, times(1)).getAccountById(accountId);

        EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload expectedPayload = EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_SUBMIT_REGULATOR_LED_PAYLOAD)
                .originalEmpContainer(empContainer)
                .emissionsMonitoringPlan(EmissionsMonitoringPlan
                        .builder()
                        .abbreviations(EmpAbbreviations.builder().exist(false).build())
                        .operatorDetails(EmpOperatorDetails.builder()
                                .activityDescription(activityDesc)
                                .operatorName(operatorName)
                                .contactAddress(contactAddress)
                                .build())
                        .build())
                .build();

        assertThat(result).isEqualTo(expectedPayload);
    }

    @Test
    void initializePayload_already_determined() {

        Long accountId = 1L;
        String operatorName = "opName";
        String activityDesc = "testActivityDescription";

        AddressStateDTO contactAddress = AddressStateDTO.builder()
                .line1("line1")
                .state("state")
                .city("city")
                .country("country")
                .build();
        EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder()
                .abbreviations(EmpAbbreviations.builder().exist(false).build())
                .operatorDetails(EmpOperatorDetails.builder()
                        .activityDescription(activityDesc)
                        .operatorName(operatorName)
                        .contactAddress(contactAddress)
                        .build())
                .build();

        EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer.builder()
                .emissionsMonitoringPlan(emp)
                .build();
        EmissionsMonitoringPlanDTO empDto = EmissionsMonitoringPlanDTO
                .builder()
                .empContainer(empContainer)
                .build();

        AddressState addressState = AddressState.builder().line1("line1")
                .state("state")
                .city("city")
                .country("country")
                .build();
        MrtmAccount accountInfo = MrtmAccount.builder().name(operatorName).address(addressState).id(accountId).build();

        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder().originalEmpContainer(empContainer).emissionsMonitoringPlan(emp).reasonRegulatorLed(
                        EmpVariationRegulatorLedReason.builder()
                                .type(EmpVariationRegulatorLedReasonType.FOLLOWING_IMPROVING_REPORT)
                                .reasonOtherSummary("SomeReasonOtherSummary")
                                .build())
                .build();

        Request request = Request.builder().requestResources(List.of(RequestResource.builder()
            .resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .payload(requestPayload).build();

        when(empQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId)).thenReturn(Optional.of(empDto));

        RequestTaskPayload result = cut.initializePayload(request);

        EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload expectedPayload = EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_SUBMIT_REGULATOR_LED_PAYLOAD)
                .originalEmpContainer(empContainer)
                .reasonRegulatorLed(EmpVariationRegulatorLedReason.builder()
                        .type(EmpVariationRegulatorLedReasonType.FOLLOWING_IMPROVING_REPORT)
                        .reasonOtherSummary("SomeReasonOtherSummary")
                        .build())
                .emissionsMonitoringPlan(EmissionsMonitoringPlan
                        .builder()
                        .abbreviations(EmpAbbreviations.builder().exist(false).build())
                        .operatorDetails(EmpOperatorDetails.builder()
                                .activityDescription(activityDesc)
                                .operatorName(operatorName)
                                .contactAddress(contactAddress)
                                .build())
                        .build())
                .build();

        assertThat(result).isEqualTo(expectedPayload);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(cut.getRequestTaskTypes()).containsExactlyInAnyOrder(MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_SUBMIT
        );
    }
}
