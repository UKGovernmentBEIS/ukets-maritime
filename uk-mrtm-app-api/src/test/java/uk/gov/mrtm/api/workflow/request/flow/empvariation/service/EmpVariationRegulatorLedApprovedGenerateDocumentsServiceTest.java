package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class EmpVariationRegulatorLedApprovedGenerateDocumentsServiceTest {

    @InjectMocks
    private EmpVariationRegulatorLedApprovedGenerateDocumentsService cut;

    @Mock
    private EmpVariationApprovedGenerateDocumentsService empVariationApprovedGenerateDocumentsService;

    @Test
    void generateDocuments() {
        String requestId = "1";

        cut.generateDocuments(requestId);

        verify(empVariationApprovedGenerateDocumentsService).generateDocuments(requestId, true);
        verifyNoMoreInteractions(empVariationApprovedGenerateDocumentsService);
    }
}