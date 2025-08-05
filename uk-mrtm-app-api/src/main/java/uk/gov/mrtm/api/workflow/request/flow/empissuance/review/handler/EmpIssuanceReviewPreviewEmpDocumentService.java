package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler.EmpIssuancePreviewEmpDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler.EmpPreviewCreateEmpDocumentService;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.List;

@Service
public class EmpIssuanceReviewPreviewEmpDocumentService extends EmpIssuancePreviewEmpDocumentService {
    public EmpIssuanceReviewPreviewEmpDocumentService(RequestTaskService requestTaskService,
                                                      EmpPreviewCreateEmpDocumentService empPreviewCreateEmpDocumentService,
                                                      DateService dateService) {
        super(requestTaskService, empPreviewCreateEmpDocumentService, dateService);
    }

    @Override
    public List<String> getTypes() {
        return List.of(
            MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_PEER_REVIEW,
            MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS
        );
    }
}
