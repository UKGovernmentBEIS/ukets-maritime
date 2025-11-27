package uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviationDefinition;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.integration.external.emp.repository.StagingEmissionsMonitoringPlanRepository;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceSaveApplicationRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestEmpServiceTest {

    @InjectMocks
    private RequestEmpService requestEmpService;

    @Mock
    private RequestService requestService;

    @Mock
    private EmpValidatorService empValidatorService;

    @Mock
    private StagingEmissionsMonitoringPlanRepository stagingEmpRepository;

    @Mock
    private DateService dateService;

    @Test
    void applySaveAction() {
        EmpIssuanceApplicationSubmitRequestTaskPayload requestTaskPayload =
                EmpIssuanceApplicationSubmitRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_SUBMIT_PAYLOAD)
                        .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                                .abbreviations(EmpAbbreviations.builder()
                                        .exist(false)
                                        .build())
                                .additionalDocuments(AdditionalDocuments.builder()
                                        .exist(false)
                                        .build())
                                .build())
                        .empSectionsCompleted(Map.of("Section A", "completed"))
                        .build();

        RequestTask requestTask = RequestTask.builder().payload(requestTaskPayload).build();

        EmissionsMonitoringPlan updatedEmissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .abbreviations(
                        EmpAbbreviations.builder()
                                .exist(true)
                                .abbreviationDefinitions(List.of(EmpAbbreviationDefinition.builder()
                                        .abbreviation("abbr")
                                        .definition("def")
                                        .build()))
                                .build())
                .additionalDocuments(
                        AdditionalDocuments.builder()
                                .exist(true)
                                .documents(Set.of(UUID.randomUUID()))
                                .build())
                .build();

        EmpIssuanceSaveApplicationRequestTaskActionPayload requestTaskActionPayload =
                EmpIssuanceSaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_ISSUANCE_SAVE_APPLICATION_PAYLOAD)
                        .emissionsMonitoringPlan(updatedEmissionsMonitoringPlan)
                        .empSectionsCompleted(Map.of("Section B", "completed"))
                        .build();

        //invoke
        requestEmpService.applySaveAction(requestTaskActionPayload, requestTask);

        //verify
        assertThat(requestTask.getPayload()).isInstanceOf(EmpIssuanceApplicationSubmitRequestTaskPayload.class);

        EmpIssuanceApplicationSubmitRequestTaskPayload payloadSaved =
                (EmpIssuanceApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        assertEquals(updatedEmissionsMonitoringPlan, payloadSaved.getEmissionsMonitoringPlan());
        assertThat(payloadSaved.getEmpSectionsCompleted()).containsExactly(Map.entry("Section B", "completed"));
    }

    @Test
    void updateStagingEmp() {
        long accountId = 1L;
        LocalDateTime now = LocalDateTime.now();

        StagingEmissionsMonitoringPlanEntity stagingEmpEntity = mock(StagingEmissionsMonitoringPlanEntity.class);

        Request request = Request.builder()
            .requestResources(List.of(RequestResource.builder().resourceType(ResourceType.ACCOUNT).resourceId(Long.toString(accountId)).build()))
            .build();

        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .build();

        when(stagingEmpRepository.findByAccountId(accountId)).thenReturn(Optional.of(stagingEmpEntity));
        when(dateService.getLocalDateTime()).thenReturn(now);

        requestEmpService.updateStagingEmp(requestTask);

        verify(stagingEmpRepository).findByAccountId(accountId);
        verify(dateService).getLocalDateTime();
        verify(stagingEmpEntity).setImportedOn(now);
        verifyNoMoreInteractions(stagingEmpRepository, stagingEmpEntity);
        verifyNoInteractions(requestService, empValidatorService);
    }

    @Test
    void applySubmitAction() {
        Long accountId = 1L;
        AppUser user = AppUser.builder().userId("userId").build();
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .abbreviations(EmpAbbreviations.builder()
                        .exist(false)
                        .build())
                .additionalDocuments(AdditionalDocuments.builder()
                        .exist(false)
                        .build())
                .build();
        Map<String, String> empSectionsCompleted = Map.of("Section A", "completed");
        EmpIssuanceApplicationSubmitRequestTaskPayload requestTaskPayload =
                EmpIssuanceApplicationSubmitRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_SUBMIT_PAYLOAD)
                        .emissionsMonitoringPlan(emissionsMonitoringPlan)
                        .empSectionsCompleted(empSectionsCompleted)
                        .build();

        EmpIssuanceRequestPayload empIssuanceRequestPayload = EmpIssuanceRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD)
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                        .build())
                .empSectionsCompleted(Map.of("Section B", "completed"))
                .build();
        Request request = Request.builder().payload(empIssuanceRequestPayload).requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build())).build();
        RequestTask requestTask = RequestTask.builder()
                .request(request)
                .payload(requestTaskPayload)
                .build();

        EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer.builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .build();

        EmissionsMonitoringPlan expectedEmissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .abbreviations(EmpAbbreviations.builder()
                        .exist(false)
                        .build())
                .additionalDocuments(AdditionalDocuments.builder()
                        .exist(false)
                        .build())
                .build();
        EmpIssuanceApplicationSubmittedRequestActionPayload empApplicationSubmittedPayload =
                EmpIssuanceApplicationSubmittedRequestActionPayload.builder()
                        .payloadType(MrtmRequestActionPayloadType.EMP_ISSUANCE_APPLICATION_SUBMITTED_PAYLOAD)
                        .emissionsMonitoringPlan(expectedEmissionsMonitoringPlan)
                        .empSectionsCompleted(empSectionsCompleted)
                        .build();

        requestEmpService.applySubmitAction(requestTask, user);

        verify(empValidatorService).validateEmissionsMonitoringPlan(empContainer, accountId);
        verify(requestService).addActionToRequest(
                request,
                empApplicationSubmittedPayload,
                MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_SUBMITTED,
                user.getUserId()
        );

        EmpIssuanceRequestPayload updatedRequestPayload = (EmpIssuanceRequestPayload) request.getPayload();

        assertNotNull(updatedRequestPayload);
        assertEquals(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD, updatedRequestPayload.getPayloadType());
        assertEquals(emissionsMonitoringPlan, updatedRequestPayload.getEmissionsMonitoringPlan());
        assertThat(updatedRequestPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(empSectionsCompleted);

        verifyNoMoreInteractions(empValidatorService, requestService);
    }

    @Test
    void applySubmitAction_invalid_emp() {
        Long accountId = 1L;
        AppUser user = AppUser.builder().userId("userId").build();
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .build();
        Map<String, String> empSectionsCompleted = Map.of("Section A", "completed");
        EmpIssuanceApplicationSubmitRequestTaskPayload requestTaskPayload =
                EmpIssuanceApplicationSubmitRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_SUBMIT_PAYLOAD)
                        .emissionsMonitoringPlan(emissionsMonitoringPlan)
                        .empSectionsCompleted(empSectionsCompleted)
                        .build();

        EmpIssuanceRequestPayload empIssuanceRequestPayload = EmpIssuanceRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD)
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                        .build())
                .empSectionsCompleted(Map.of("Section B", "completed"))
                .build();
        Request request = Request.builder().payload(empIssuanceRequestPayload).requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build())).build();
        RequestTask requestTask = RequestTask.builder()
                .request(request)
                .payload(requestTaskPayload)
                .build();

        EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer.builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .build();

        EmissionsMonitoringPlan expectedEmissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .build();
        EmpIssuanceApplicationSubmittedRequestActionPayload empApplicationSubmittedPayload =
                EmpIssuanceApplicationSubmittedRequestActionPayload.builder()
                        .payloadType(MrtmRequestActionPayloadType.EMP_ISSUANCE_APPLICATION_SUBMITTED_PAYLOAD)
                        .emissionsMonitoringPlan(expectedEmissionsMonitoringPlan)
                        .empSectionsCompleted(empSectionsCompleted)
                        .build();

        doThrow(new BusinessException(MrtmErrorCode.INVALID_EMP))
                .when(empValidatorService).validateEmissionsMonitoringPlan(empContainer, accountId);


        final BusinessException be = assertThrows(BusinessException.class, () -> requestEmpService.applySubmitAction(requestTask, user));

        assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.INVALID_EMP);

        verify(empValidatorService).validateEmissionsMonitoringPlan(empContainer, accountId);
        verify(requestService, never()).addActionToRequest(
                request,
                empApplicationSubmittedPayload,
                MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_SUBMITTED,
                user.getUserId()
        );
    }
}
