package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationChangeType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationMapper;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationSubmitMapper;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.validator.EmpVariationDetailsValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationSubmitServiceTest {

    @InjectMocks
    private EmpVariationSubmitService empVariationSubmitService;

    @Mock
    private EmpValidatorService empValidatorService;

    @Mock
    private EmpVariationDetailsValidator detailsValidator;

    @Mock
    private RequestService requestService;

    @Mock
    private MrtmAccountQueryService accountQueryService;

    @Test
    void saveEmpVariation() {
        EmpVariationApplicationSubmitRequestTaskPayload taskPayload =
                new EmpVariationApplicationSubmitRequestTaskPayload();
        EmissionsMonitoringPlan emissionsMonitoringPlan = mock(EmissionsMonitoringPlan.class);
        EmpVariationDetails empVariationDetails = mock(EmpVariationDetails.class);
        String empVariationDetailsCompleted = "true";
        Set<EmpReviewGroup> updatedSubtasks = Set.of(EmpReviewGroup.ADDITIONAL_DOCUMENTS);

        taskPayload.setEmissionsMonitoringPlan(emissionsMonitoringPlan);
        taskPayload.setEmpVariationDetails(empVariationDetails);
        taskPayload.setEmpVariationDetailsCompleted(empVariationDetailsCompleted);
        taskPayload.setUpdatedSubtasks(updatedSubtasks);

        EmpVariationSaveApplicationRequestTaskActionPayload taskActionPayload =
                new EmpVariationSaveApplicationRequestTaskActionPayload();

        RequestTask requestTask = new RequestTask();
        requestTask.setPayload(taskPayload);
        empVariationSubmitService.saveEmpVariation(taskActionPayload, requestTask);

        assertEquals(taskPayload.getEmissionsMonitoringPlan(), taskActionPayload.getEmissionsMonitoringPlan());
        assertEquals(taskPayload.getEmpVariationDetails(), taskActionPayload.getEmpVariationDetails());
        assertEquals(taskPayload.getEmpVariationDetailsCompleted(), taskActionPayload.getEmpVariationDetailsCompleted());
        assertEquals(taskPayload.getEmpSectionsCompleted(), taskActionPayload.getEmpSectionsCompleted());
        assertEquals(taskPayload.getUpdatedSubtasks(), taskActionPayload.getUpdatedSubtasks());
    }

    @Test
    void submitEmpVariation() {
        Long accountId = 1L;
        AppUser appUser = AppUser.builder().userId("user1").build();
        UUID att1UUID = UUID.randomUUID();
        String operatorName = "Operator name";
        Set<EmpReviewGroup> updatedSubtasks = Set.of(EmpReviewGroup.ADDITIONAL_DOCUMENTS);
        final AddressState contactAddress = AddressState.builder().line1("line1").state("state").city("city").build();
        final AddressStateDTO contactAddressDTO = AddressStateDTO.builder().line1("line1").state("state").city("city").build();
        Request request = Request.builder()
                .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
                .id("1")
                .payload(EmpVariationRequestPayload.builder().build())
                .build();
        final MrtmAccount mrtmAccount = MrtmAccount.builder()
                .imoNumber("1234567")
                .name(operatorName)
                .address(contactAddress)
                .build();

        EmpVariationDetails details = EmpVariationDetails
                .builder()
                .reason("test reason")
                .changes(List.of(
                        EmpVariationChangeType.ADD_NEW_SHIP,
                        EmpVariationChangeType.ADD_NEW_FUELS_OR_EMISSION_SOURCES))
                .build();

        EmissionsMonitoringPlan emp = EmissionsMonitoringPlan
                .builder()
                .abbreviations(EmpAbbreviations.builder()
                        .exist(false).build())
                .operatorDetails(EmpOperatorDetails.builder()
                        .operatorName("op1")
                        .build())
                .build();

        EmpVariationApplicationSubmitRequestTaskPayload requestTaskPayload = EmpVariationApplicationSubmitRequestTaskPayload.builder()
                .emissionsMonitoringPlan(emp)
                .empVariationDetails(details)
                .empVariationDetailsCompleted("true")
                .empSectionsCompleted(Map.of("section1", "completed"))
                .empAttachments(Map.of(att1UUID, "att1"))
                .updatedSubtasks(updatedSubtasks)
                .build();
        RequestTask requestTask = RequestTask.builder()
                .request(request)
                .payload(requestTaskPayload)
                .build();

        when(accountQueryService.getAccountById(1L)).thenReturn(mrtmAccount);

        empVariationSubmitService.submitEmpVariation(requestTask, appUser);

        verify(empValidatorService, times(1)).validateEmissionsMonitoringPlan(Mappers
                .getMapper(EmpVariationMapper.class).toEmissionsMonitoringPlanContainer(requestTaskPayload), accountId);
        EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();
        assertThat(requestPayload.getEmissionsMonitoringPlan()).isEqualTo(emp);
        assertThat(requestPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(Map.of("section1", "completed"));
        assertThat(requestPayload.getEmpAttachments()).containsExactlyInAnyOrderEntriesOf(Map.of(att1UUID, "att1"));
        assertThat(requestPayload.getEmpVariationDetails()).isEqualTo(details);
        assertThat(requestPayload.getEmpVariationDetailsCompleted()).isEqualTo("true");
        assertThat(requestPayload.getUpdatedSubtasks()).isEqualTo(updatedSubtasks);
        verify(detailsValidator, times(1)).validate(details);

        EmpVariationApplicationSubmittedRequestActionPayload actionPayload = Mappers
                .getMapper(EmpVariationSubmitMapper.class).toEmpVariationApplicationSubmittedRequestActionPayload(
                        (EmpVariationApplicationSubmitRequestTaskPayload) requestTask.getPayload(), operatorName, contactAddressDTO);
        verify(requestService, times(1)).addActionToRequest(request, actionPayload, MrtmRequestActionType.EMP_VARIATION_APPLICATION_SUBMITTED, appUser.getUserId());
        verifyNoMoreInteractions(accountQueryService, empValidatorService, detailsValidator, requestService);
    }
}