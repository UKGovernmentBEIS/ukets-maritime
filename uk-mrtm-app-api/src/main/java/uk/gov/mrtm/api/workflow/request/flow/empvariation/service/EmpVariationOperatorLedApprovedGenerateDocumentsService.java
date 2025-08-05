package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmpVariationOperatorLedApprovedGenerateDocumentsService {

    private final EmpVariationApprovedGenerateDocumentsService empVariationApprovedGenerateDocumentsService;

    @Transactional
    public void generateDocuments(String requestId) {
        empVariationApprovedGenerateDocumentsService.generateDocuments(requestId, false);
    }
}
