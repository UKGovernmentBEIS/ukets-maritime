package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationRespondToRegulatorCommentsRequestTaskPayload;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.common.utils.DateUtils;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class CalculateRespondToRegulatorCommentsExpirationDateService {

    private final RequestService requestService;

    private static final List<String> TASK_TYPES = List.of(
        MrtmRequestTaskType.VIR_RESPOND_TO_REGULATOR_COMMENTS
    );

    public Date calculateExpirationDate(String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final RequestTask task = request.getRequestTasks().stream()
                .filter(requestTask -> TASK_TYPES.contains(requestTask.getType().getCode()))
                .findFirst().orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        final VirApplicationRespondToRegulatorCommentsRequestTaskPayload payload
                = (VirApplicationRespondToRegulatorCommentsRequestTaskPayload) task.getPayload();

        return calculateExpirationDate(payload.getRegulatorImprovementResponses());
    }

    private Date calculateExpirationDate(Map<String, RegulatorImprovementResponse> regulatorImprovementResponses) {
        final LocalDate expirationDate = regulatorImprovementResponses.values().stream()
                .filter(RegulatorImprovementResponse::isImprovementRequired)
                .map(RegulatorImprovementResponse::getImprovementDeadline)
                .min(LocalDate::compareTo).orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        return DateUtils.atEndOfDay(expirationDate);
    }
}
