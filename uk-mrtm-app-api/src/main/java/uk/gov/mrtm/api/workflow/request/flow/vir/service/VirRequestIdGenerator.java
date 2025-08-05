package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestMetadata;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestIdGenerator;

import java.util.List;

@Service
public class VirRequestIdGenerator implements RequestIdGenerator {

    @Override
    public String generate(final RequestParams params) {

        final Long accountId = params.getAccountId();
        final VirRequestMetadata metaData = (VirRequestMetadata) params.getRequestMetadata();
        final int year = metaData.getYear().getValue();

        return String.format("%s%05d-%d", getPrefix(), accountId, year);
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestType.VIR);
    }

    @Override
    public String getPrefix() {
        return "MAVIR";
    }
}
