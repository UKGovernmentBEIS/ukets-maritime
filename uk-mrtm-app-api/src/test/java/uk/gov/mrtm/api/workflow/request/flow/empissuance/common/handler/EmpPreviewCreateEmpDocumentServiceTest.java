package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentTemplateEmpParamsSourceData;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.MrtmAccountTemplateParams;
import uk.gov.mrtm.api.workflow.request.flow.common.service.DocumentTemplateEmpParamsProvider;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.workflow.request.core.domain.Request;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpPreviewCreateEmpDocumentServiceTest {

    @InjectMocks
    private EmpPreviewCreateEmpDocumentService service;

    @Mock
    private DocumentTemplateEmpParamsProvider empParamsProvider;

    @Test
    void constructTemplateParams(){
        final Request request = Request.builder().build();
        final String signatory = "sig";
        final int consolidationNumber = 1;
        final Long accountId = 1L;
        List<EmpVariationRequestInfo> variationRequestInfoList = List.of(mock(EmpVariationRequestInfo.class));
        EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder()
            .operatorDetails(
                EmpOperatorDetails
                    .builder()
                    .operatorName("name")
                    .build()
            )
            .build();
        EmissionsMonitoringPlanDTO empDTO =  EmissionsMonitoringPlanDTO.builder()
            .empContainer(
                EmissionsMonitoringPlanContainer.builder()
                    .emissionsMonitoringPlan(emp)
                    .build())
            .consolidationNumber(consolidationNumber)
            .accountId(accountId)
            .build();

        LocalDateTime empSubmissionDate = LocalDateTime.now();
        LocalDateTime empEndDate = LocalDateTime.now().plusDays(1);

        DocumentTemplateEmpParamsSourceData documentTemplateEmpParamsSourceData = DocumentTemplateEmpParamsSourceData.builder()
            .request(request)
            .signatory(signatory)
            .variationRequestInfoList(variationRequestInfoList)
            .empContainer(empDTO.getEmpContainer())
            .consolidationNumber(consolidationNumber)
            .empEndDate(empEndDate)
            .empSubmissionDate(empSubmissionDate)
            .build();

        TemplateParams expectedTemplateParams = TemplateParams.builder()
            .permitId(empDTO.getId())
            .accountParams(MrtmAccountTemplateParams.builder().name("name").build())
            .build();

        when(empParamsProvider.constructTemplateParams(documentTemplateEmpParamsSourceData)).thenReturn(TemplateParams.builder()
            .accountParams(MrtmAccountTemplateParams.builder().build())
            .build());

        TemplateParams actualTemplateParams = service.constructTemplateParams(request, signatory, empDTO,
            variationRequestInfoList, consolidationNumber, empSubmissionDate, empEndDate);

        assertEquals(expectedTemplateParams, actualTemplateParams);
        verify(empParamsProvider,times(1)).constructTemplateParams(documentTemplateEmpParamsSourceData);
    }
}
