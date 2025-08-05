package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EmpVariationOperatorLedApprovedGenerateDocumentsServiceTest {

    @InjectMocks
    private EmpVariationOperatorLedApprovedGenerateDocumentsService service;

    @Mock
    private EmpVariationApprovedGenerateDocumentsService empVariationApprovedGenerateDocumentsService;

    @Test
    void generateDocuments() {
        String requestId = "requestId";
        service.generateDocuments(requestId);

        verify(empVariationApprovedGenerateDocumentsService, times(1)).generateDocuments(requestId, false);
    }
}
