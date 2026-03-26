package uk.gov.mrtm.api.mireport.system.executedactions;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.mireport.system.MiReportSystemType;
import uk.gov.netz.api.mireport.system.executedactions.ExecutedRequestActionsMiReportParams;
import uk.gov.netz.api.mireport.system.executedactions.ExecutedRequestActionsMiReportResult;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MaritimeExecutedRequestActionsReportGeneratorHandlerTest {

    @InjectMocks
    private MaritimeExecutedRequestActionsReportGeneratorHandler generator;

    @Mock
    private MaritimeExecutedRequestActionsRepository repository;

    @Mock
    private EntityManager entityManager;

    @Test
    void generateMiReport() {
        ExecutedRequestActionsMiReportParams reportParams = ExecutedRequestActionsMiReportParams.builder()
                .reportType(MiReportSystemType.COMPLETED_WORK)
                .fromDate(LocalDate.now())
                .build();
        List<MaritimeExecutedRequestAction> executedRequestActions = List.of(
                MaritimeExecutedRequestAction.builder()
                        .accountId("businessId")
                        .accountName("accountName")
                        .accountStatus(MrtmAccountStatus.LIVE.name())
                        .requestId("REQ-1")
                        .requestType(MrtmRequestType.EMP_ISSUANCE)
                        .requestStatus(RequestStatuses.IN_PROGRESS)
                        .requestActionType(MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_SUBMITTED)
                        .requestActionSubmitter("submitter")
                        .requestActionCompletionDate(LocalDateTime.now())
                        .imoNumber("0000001")
                        .build());

        when(repository.findExecutedRequestActions(entityManager, reportParams)).thenReturn(executedRequestActions);

        ExecutedRequestActionsMiReportResult report =
                (ExecutedRequestActionsMiReportResult) generator.generateMiReport(entityManager, reportParams);

        assertNotNull(report);
        assertEquals(MiReportSystemType.COMPLETED_WORK, report.getReportType());
        assertThat(report.getResults()).containsExactlyElementsOf(executedRequestActions);
    }

    @Test
    void getReportType() {
        assertThat(generator.getReportType()).isEqualTo(MiReportSystemType.COMPLETED_WORK);
    }

    @Test
    void getColumnNames() {
        assertThat(generator.getColumnNames()).containsExactlyElementsOf(MaritimeExecutedRequestAction.getColumnNames());
    }
}
