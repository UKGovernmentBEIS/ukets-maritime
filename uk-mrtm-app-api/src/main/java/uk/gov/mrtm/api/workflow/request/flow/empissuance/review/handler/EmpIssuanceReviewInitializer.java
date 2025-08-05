package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.mapper.EmpReviewMapper;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

@Service
@RequiredArgsConstructor
public abstract class EmpIssuanceReviewInitializer implements InitializeRequestTaskHandler {

    private static final EmpReviewMapper EMP_REVIEW_MAPPER = Mappers.getMapper(EmpReviewMapper.class);

    protected abstract String getRequestTaskPayloadType();

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        return EMP_REVIEW_MAPPER.toEmpIssuanceApplicationReviewRequestTaskPayload(
            (EmpIssuanceRequestPayload) request.getPayload(),
            getRequestTaskPayloadType()
        );
    }
}