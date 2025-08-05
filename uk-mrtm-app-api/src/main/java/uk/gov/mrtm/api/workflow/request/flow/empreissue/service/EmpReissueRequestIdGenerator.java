package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestIdGenerator;

import java.util.List;

@Service
public class EmpReissueRequestIdGenerator implements RequestIdGenerator {
	
	private static final String REQUEST_ID_FORMATTER = "%s%05d-%s";

    @Override
    public String generate(RequestParams params) {
        final Long accountId = params.getAccountId();
        final EmpReissueRequestMetadata metaData = (EmpReissueRequestMetadata) params.getRequestMetadata();
		return String.format(REQUEST_ID_FORMATTER, getPrefix(), accountId, metaData.getBatchRequestId());
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestType.EMP_REISSUE);
    }

    @Override
    public String getPrefix() {
        return "B";
    }

}
