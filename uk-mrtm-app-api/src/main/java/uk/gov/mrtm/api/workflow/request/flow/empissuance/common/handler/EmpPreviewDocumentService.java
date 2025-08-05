package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler;

import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.List;

public interface EmpPreviewDocumentService {

    FileDTO create(Long taskId, DecisionNotification decisionNotification);
    
    List<String> getTypes();
}
