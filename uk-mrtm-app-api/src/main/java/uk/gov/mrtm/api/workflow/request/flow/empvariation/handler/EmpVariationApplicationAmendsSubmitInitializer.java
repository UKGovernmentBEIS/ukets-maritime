package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationAmendSubmitMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class EmpVariationApplicationAmendsSubmitInitializer implements InitializeRequestTaskHandler {

    private static final EmpVariationAmendSubmitMapper MAPPER = Mappers.getMapper(EmpVariationAmendSubmitMapper.class);

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        return MAPPER.toEmpVariationApplicationAmendsSubmitRequestTaskPayload(
            (EmpVariationRequestPayload)request.getPayload(),
            MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_AMENDS_SUBMIT_PAYLOAD
        );
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_AMENDS_SUBMIT);
    }
}
