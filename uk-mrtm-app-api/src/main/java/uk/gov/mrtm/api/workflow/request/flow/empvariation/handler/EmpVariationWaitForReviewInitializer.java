package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
public class EmpVariationWaitForReviewInitializer implements InitializeRequestTaskHandler {

    private static final EmpVariationMapper EMP_VARIATION_MAPPER = Mappers.getMapper(EmpVariationMapper.class);

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        return EMP_VARIATION_MAPPER.toEmpVariationApplicationSubmitRequestTaskPayload(
            (EmpVariationRequestPayload) request.getPayload(),
            MrtmRequestTaskPayloadType.EMP_VARIATION_WAIT_FOR_REVIEW_PAYLOAD);
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_VARIATION_WAIT_FOR_REVIEW);
    }
}
