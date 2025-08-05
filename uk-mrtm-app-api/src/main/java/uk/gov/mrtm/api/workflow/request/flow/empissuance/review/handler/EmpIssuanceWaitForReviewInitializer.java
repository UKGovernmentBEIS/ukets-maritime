package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.transform.EmpSubmitMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
public class EmpIssuanceWaitForReviewInitializer implements InitializeRequestTaskHandler {

    private static final EmpSubmitMapper EMP_SUBMIT_MAPPER = Mappers.getMapper(EmpSubmitMapper.class);

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        return EMP_SUBMIT_MAPPER.toEmpIssuanceApplicationSubmitRequestTaskPayload(
            (EmpIssuanceRequestPayload) request.getPayload(),
            MrtmRequestTaskPayloadType.EMP_ISSUANCE_WAIT_FOR_REVIEW_PAYLOAD);
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_REVIEW);
    }
}
