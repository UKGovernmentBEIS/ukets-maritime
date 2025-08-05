package uk.gov.mrtm.api.web.config.swagger;

import org.springframework.stereotype.Component;

import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestCreateActionPayload;
import uk.gov.netz.api.swagger.SwaggerSchemasAbstractProvider;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestCreateActionEmptyPayload;

@Component
public class RequestCreateActionPayloadSchemasProvider extends SwaggerSchemasAbstractProvider {
    
    @Override
    public void afterPropertiesSet() {
    	//common
    	addResolvedShemas(ReportRelatedRequestCreateActionPayload.class.getSimpleName(), ReportRelatedRequestCreateActionPayload.class);
    	
    	addResolvedShemas(RequestCreateActionEmptyPayload.class.getSimpleName(), RequestCreateActionEmptyPayload.class);

        //Batch Reissue
        addResolvedShemas(EmpBatchReissueRequestCreateActionPayload.class.getSimpleName(), EmpBatchReissueRequestCreateActionPayload.class);
    	//project specific
    }
    
}
