package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpPreviewHandlerTest {

    private final long taskId;
    private final DecisionNotification decisionNotification;
    private final FileDTO fileDTO;

    @InjectMocks
    private EmpPreviewHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private EmpIssuancePreviewEmpDocumentService empIssuancePreviewEmpDocumentService;

    @Spy
    private ArrayList<EmpPreviewDocumentService> previewDocumentServices;

    public EmpPreviewHandlerTest() {
        taskId = 1L;
        decisionNotification = DecisionNotification.builder().build();
        fileDTO = FileDTO.builder().fileName("fileName").build();
    }


    @BeforeEach
    public void setUp() {
        previewDocumentServices.add(empIssuancePreviewEmpDocumentService);
    }


    @Test
    void generateDocument() {
        when(empIssuancePreviewEmpDocumentService.getTypes()).thenReturn(List.of(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW));
        when(requestTaskService.findTaskById(taskId)).thenReturn(RequestTask.builder().type(
            RequestTaskType.builder().code(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW).build()).build()
        );
        when(empIssuancePreviewEmpDocumentService.create(taskId, decisionNotification)).thenReturn(fileDTO);

        final FileDTO result = handler.generateDocument(taskId, decisionNotification);

        assertEquals(result, fileDTO);

        verify(empIssuancePreviewEmpDocumentService, times(1)).create(taskId, decisionNotification);
    }


    @Test
    void generateDocument_previewDocumentServiceDoesntExist_throwException() {
        when(requestTaskService.findTaskById(taskId)).thenReturn(RequestTask.builder()
            .type(RequestTaskType.builder().code(MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS).build()).build());

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            handler.generateDocument(taskId, decisionNotification);
        });

        String actualCode = exception.getErrorCode().getCode();
        assertEquals(actualCode, ErrorCode.INVALID_DOCUMENT_TEMPLATE_FOR_REQUEST_TASK.getCode());
        assertTrue(Arrays.asList(exception.getData())
            .contains(RequestTaskType.builder().code(MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS).build()));
    }

    @Test
    void getTypes() {
        assertIterableEquals(List.of(MrtmDocumentTemplateType.EMP), handler.getTypes());
    }

    @Test
    void getTaskTypes() {
        assertIterableEquals(List.of(
            MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_PEER_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS,

            MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_WAIT_FOR_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_WAIT_FOR_AMENDS,

            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_SUBMIT,
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_WAIT_FOR_PEER_REVIEW
        ), handler.getTaskTypes());
    }
}
