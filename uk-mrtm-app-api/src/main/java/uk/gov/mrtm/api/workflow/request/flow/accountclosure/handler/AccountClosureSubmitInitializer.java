package uk.gov.mrtm.api.workflow.request.flow.accountclosure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosureSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AccountClosureSubmitInitializer implements InitializeRequestTaskHandler {

	@Override
    public RequestTaskPayload initializePayload(Request request) {

        return AccountClosureSubmitRequestTaskPayload
        		.builder()
        		.payloadType(MrtmRequestTaskPayloadType.ACCOUNT_CLOSURE_SUBMIT_PAYLOAD)
        		.build();
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.ACCOUNT_CLOSURE_SUBMIT);
    }
}
