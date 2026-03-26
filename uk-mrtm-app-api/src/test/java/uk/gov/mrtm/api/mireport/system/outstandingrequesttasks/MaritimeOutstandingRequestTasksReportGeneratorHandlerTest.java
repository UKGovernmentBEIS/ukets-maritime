package uk.gov.mrtm.api.mireport.system.outstandingrequesttasks;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.mireport.system.MiReportSystemType;
import uk.gov.netz.api.mireport.system.outstandingrequesttasks.OutstandingRegulatorRequestTasksMiReportParams;
import uk.gov.netz.api.mireport.system.outstandingrequesttasks.OutstandingRequestTasksMiReportResult;
import uk.gov.netz.api.userinfoapi.UserInfo;
import uk.gov.netz.api.userinfoapi.UserInfoApi;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MaritimeOutstandingRequestTasksReportGeneratorHandlerTest {

    @InjectMocks
    private MaritimeOutstandingRequestTasksReportGeneratorHandler generator;

    @Mock
    private MaritimeOutstandingRequestTasksRepository outstandingRequestTasksRepository;

    @Mock
    private MaritimeOutstandingRequestTasksReportService outstandingRequestTasksReportService;

    @Mock
    private UserInfoApi userInfoApi;

    @Mock
    private EntityManager entityManager;

    @Captor
    private ArgumentCaptor<OutstandingRegulatorRequestTasksMiReportParams> argumentCaptor;

    @Test
    void generateMiReport() {
        String userId1 = UUID.randomUUID().toString();
        String userId2 = UUID.randomUUID().toString();
        OutstandingRegulatorRequestTasksMiReportParams params = OutstandingRegulatorRequestTasksMiReportParams.builder()
                .userIds(Set.of(userId1, userId2))
                .requestTaskTypes(
                        new HashSet<>(List.of(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT, MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_RFI_RESPONSE,
                                MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_RDE_RESPONSE)))
                .build();

        List<MaritimeOutstandingRequestTask> expectedOutstandingRequestTasks = List.of(
                MaritimeOutstandingRequestTask.builder()
                        .accountId("businessId1")
                        .requestId(UUID.randomUUID().toString())
                        .requestType(MrtmRequestType.EMP_ISSUANCE)
                        .requestTaskType(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW)
                        .requestTaskAssignee(userId1)
                        .requestTaskAssigneeName("Jon Jones")
                        .requestTaskDueDate(null)
                        .requestTaskRemainingDays(null)
                        .imoNumber("0000001")
                        .build(),
                MaritimeOutstandingRequestTask.builder()
                        .accountId("businessId2")
                        .requestId(UUID.randomUUID().toString())
                        .requestType(MrtmRequestType.EMP_ISSUANCE)
                        .requestTaskType(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT)
                        .requestTaskAssignee(userId2)
                        .requestTaskAssigneeName("Stan Smith")
                        .requestTaskDueDate(LocalDate.now().plusDays(10))
                        .requestTaskRemainingDays(10L)
                        .imoNumber("0000002")
                        .build()
        );

        when(outstandingRequestTasksReportService.getRequestTaskTypesByRoleType(RoleTypeConstants.REGULATOR))
                .thenReturn(Set.of(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT));

        when(outstandingRequestTasksRepository.findOutstandingRequestTaskParams(any(), argumentCaptor.capture())).thenReturn(expectedOutstandingRequestTasks);
        when(userInfoApi.getUsers(List.of(userId1, userId2))).thenReturn(
                List.of(
                        UserInfo.builder().id(userId1).firstName("Jon").lastName("Jones").build(),
                        UserInfo.builder().id(userId2).firstName("Stan").lastName("Smith").build()
                )
        );

        OutstandingRequestTasksMiReportResult miReportResult = (OutstandingRequestTasksMiReportResult) generator.generateMiReport(entityManager, params);

        assertThat(miReportResult.getResults()).hasSize(2);
        assertThat(argumentCaptor.getValue().getRequestTaskTypes()).containsExactly(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT);
        assertThat(miReportResult.getResults()).containsExactlyElementsOf(expectedOutstandingRequestTasks);
        assertThat(miReportResult.getReportType()).isEqualTo(MiReportSystemType.REGULATOR_OUTSTANDING_REQUEST_TASKS);
    }

    @Test
    void generateMiReport_all_request_tasks() {
        String userId1 = UUID.randomUUID().toString();
        String userId2 = UUID.randomUUID().toString();
        OutstandingRegulatorRequestTasksMiReportParams params = OutstandingRegulatorRequestTasksMiReportParams.builder()
                .userIds(Set.of(userId1, userId2))
                .requestTaskTypes(new HashSet<>())
                .build();

        List<MaritimeOutstandingRequestTask> expectedOutstandingRequestTasks = List.of(
                MaritimeOutstandingRequestTask.builder()
                        .accountId("accountId1")
                        .requestId(UUID.randomUUID().toString())
                        .requestType(MrtmRequestType.EMP_ISSUANCE)
                        .requestTaskType(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT)
                        .requestTaskAssignee(userId1)
                        .requestTaskAssigneeName("Jon Jones")
                        .requestTaskDueDate(null)
                        .requestTaskRemainingDays(null)
                        .imoNumber("0000001")
                        .build(),
                MaritimeOutstandingRequestTask.builder()
                        .accountId("emitterId2")
                        .requestId(UUID.randomUUID().toString())
                        .requestType(MrtmRequestType.EMP_ISSUANCE)
                        .requestTaskType(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW)
                        .requestTaskAssignee(userId2)
                        .requestTaskAssigneeName("Stan Smith")
                        .requestTaskDueDate(LocalDate.now().plusDays(10))
                        .requestTaskRemainingDays(10L)
                        .imoNumber("0000002")
                        .build()
        );

        when(outstandingRequestTasksReportService.getRequestTaskTypesByRoleType(RoleTypeConstants.REGULATOR))
                .thenReturn(Set.of(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT));

        when(outstandingRequestTasksRepository.findOutstandingRequestTaskParams(any(), argumentCaptor.capture())).thenReturn(expectedOutstandingRequestTasks);
        when(userInfoApi.getUsers(List.of(userId1, userId2))).thenReturn(
                List.of(
                        UserInfo.builder().id(userId1).firstName("Jon").lastName("Jones").build(),
                        UserInfo.builder().id(userId2).firstName("Stan").lastName("Smith").build()
                )
        );

        OutstandingRequestTasksMiReportResult miReportResult = (OutstandingRequestTasksMiReportResult) generator.generateMiReport(entityManager, params);

        assertThat(miReportResult.getResults()).hasSize(2);
        assertThat(argumentCaptor.getValue().getRequestTaskTypes()).containsExactly(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT);
        assertThat(miReportResult.getResults()).containsExactlyElementsOf(expectedOutstandingRequestTasks);
        assertThat(miReportResult.getReportType()).isEqualTo(MiReportSystemType.REGULATOR_OUTSTANDING_REQUEST_TASKS);
    }

    @Test
    void getColumnNames() {
        assertThat(generator.getColumnNames()).containsExactlyElementsOf(MaritimeOutstandingRequestTask.getColumnNames());
    }
}
