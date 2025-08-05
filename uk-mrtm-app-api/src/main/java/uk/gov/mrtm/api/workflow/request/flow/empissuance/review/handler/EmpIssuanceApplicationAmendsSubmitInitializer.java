package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.mapper.EmpReviewMapper;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class EmpIssuanceApplicationAmendsSubmitInitializer implements InitializeRequestTaskHandler {

    private static final EmpReviewMapper EMP_REVIEW_MAPPER = Mappers.getMapper(EmpReviewMapper.class);

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        return EMP_REVIEW_MAPPER.toEmpIssuanceApplicationAmendsSubmitRequestTaskPayload(
            (EmpIssuanceRequestPayload) request.getPayload(),
            MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_AMENDS_SUBMIT_PAYLOAD
        );
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_AMENDS_SUBMIT);
    }
}
