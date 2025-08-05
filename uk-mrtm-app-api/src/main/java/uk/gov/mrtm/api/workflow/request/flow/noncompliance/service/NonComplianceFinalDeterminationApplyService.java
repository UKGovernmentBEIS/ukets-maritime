package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationSaveApplicationRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

@Service
@RequiredArgsConstructor
public class NonComplianceFinalDeterminationApplyService {

    @Transactional
    public void applySaveAction(final RequestTask requestTask,
                                final NonComplianceFinalDeterminationSaveApplicationRequestTaskActionPayload taskActionPayload) {

        final NonComplianceFinalDeterminationRequestTaskPayload
            requestTaskPayload = (NonComplianceFinalDeterminationRequestTaskPayload) requestTask.getPayload();

        requestTaskPayload.setFinalDetermination(taskActionPayload.getFinalDetermination());
        requestTaskPayload.setSectionsCompleted(taskActionPayload.getSectionsCompleted());
    }
}
