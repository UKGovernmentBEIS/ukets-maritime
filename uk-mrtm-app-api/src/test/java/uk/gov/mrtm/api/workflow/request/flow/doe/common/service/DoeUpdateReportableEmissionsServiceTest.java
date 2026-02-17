package uk.gov.mrtm.api.workflow.request.flow.doe.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.ReportableEmissionsSaveParams;
import uk.gov.mrtm.api.reporting.service.ReportableEmissionsService;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReason;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonDetails;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeMaritimeEmissions;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeTotalMaritimeEmissions;
import uk.gov.mrtm.api.workflow.request.flow.registry.service.EmissionsUpdatedEventAddRequestActionService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.math.BigDecimal;
import java.time.Year;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoeUpdateReportableEmissionsServiceTest {

    @InjectMocks
    private DoeUpdateReportableEmissionsService service;

    @Mock
    private RequestService requestService;

    @Mock
    private ReportableEmissionsService reportableEmissionsService;

    @Mock
    private EmissionsUpdatedEventAddRequestActionService emissionsUpdatedEventAddRequestActionService;

    @Test
    void updateReportableEmissions() {
        String requestId = "1";
        String regulatorAssignee = "userId";
        BigDecimal surrenderEmissions = new BigDecimal("1");
        BigDecimal totalReportableEmissions = new BigDecimal("2");
        BigDecimal lessVoyagesInNorthernIrelandDeduction = new BigDecimal("3");
        BigDecimal smallIslandFerryDeduction = new BigDecimal("4");

        Request request = Request.builder()
            .payload(DoeRequestPayload.builder()
                .regulatorAssignee(regulatorAssignee)
                .doe(Doe.builder().maritimeEmissions(
                    DoeMaritimeEmissions.builder()
                            .totalMaritimeEmissions(DoeTotalMaritimeEmissions.builder()
                                .surrenderEmissions(surrenderEmissions)
                                .totalReportableEmissions(totalReportableEmissions)
                                .lessVoyagesInNorthernIrelandDeduction(lessVoyagesInNorthernIrelandDeduction)
                                .calculationApproach("calculationApproach").build())
                            .chargeOperator(false)
                        .determinationReason(DoeDeterminationReason.builder()
                                .details(DoeDeterminationReasonDetails.builder()
                                    .type(DoeDeterminationReasonType.IMPOSING_OR_CONSIDERING_IMPOSING_CIVIL_PENALTY_IN_ACCORDANCE_WITH_ORDER)
                                    .noticeText("noticeText")
                                    .build())
                                .furtherDetails("furtherDetails")
                                .build())
                    .build())
                .build())
            .build())
            .metadata(DoeRequestMetadata.builder()
                .year(Year.of(2022))
                .build())
            .build();
        final ReportableEmissionsSaveParams saveParams = ReportableEmissionsSaveParams.builder()
                .accountId(request.getAccountId())
                .year(Year.of(2022))
                .reportableEmissions(AerTotalReportableEmissions.builder()
                    .surrenderEmissions(surrenderEmissions)
                    .totalEmissions(totalReportableEmissions)
                    .lessVoyagesInNorthernIrelandDeduction(lessVoyagesInNorthernIrelandDeduction)
                    .build())
                .isFromDoe(true)
                .build();
        ReportableEmissionsUpdatedSubmittedEventDetails eventDetails =
            mock(ReportableEmissionsUpdatedSubmittedEventDetails.class);


        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(reportableEmissionsService.saveReportableEmissions(saveParams)).thenReturn(eventDetails);

        service.updateReportableEmissions(requestId);

        verify(requestService).findRequestById(requestId);
        verify(reportableEmissionsService).saveReportableEmissions(saveParams);
        verify(emissionsUpdatedEventAddRequestActionService).addRequestAction(request, eventDetails, regulatorAssignee);
        verifyNoMoreInteractions(requestService, reportableEmissionsService, emissionsUpdatedEventAddRequestActionService);
    }
}
