package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler.flowable;


import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestCustomContext;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class EmpVariationSetRegulatorLedRequestTypePrefixHandlerFlowable implements JavaDelegate {

    @Override
    public void execute(DelegateExecution execution) {
        execution.setVariable(BpmnProcessConstants.REQUEST_TYPE_DYNAMIC_TASK_PREFIX,
                MrtmRequestCustomContext.EMP_VARIATION_REGULATOR_LED.getCode());
    }
}
