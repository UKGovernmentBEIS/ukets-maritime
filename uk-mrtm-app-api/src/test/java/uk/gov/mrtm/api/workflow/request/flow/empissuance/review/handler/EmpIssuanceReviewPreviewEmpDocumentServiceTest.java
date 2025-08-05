package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceReviewPreviewEmpDocumentServiceTest {

    @InjectMocks
    private EmpIssuanceReviewPreviewEmpDocumentService service;

    @Test
    void getType() {
        assertEquals(List.of(
            MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_PEER_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS
        ), service.getTypes());
    }
}