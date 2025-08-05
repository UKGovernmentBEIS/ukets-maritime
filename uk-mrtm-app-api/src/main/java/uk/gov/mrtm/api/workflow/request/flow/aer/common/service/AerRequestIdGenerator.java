package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestIdGenerator;

import java.time.Year;
import java.util.List;


@Service
public class AerRequestIdGenerator implements RequestIdGenerator {

    @Override
    public String generate(RequestParams params) {
        Long accountId = params.getAccountId();
        AerRequestMetadata metaData = (AerRequestMetadata) params.getRequestMetadata();

        return generate(metaData.getYear(), accountId);
    }

    private String generate(Year year, Long accountId) {
        return String.format("%s%05d-%d", getPrefix(), accountId, year.getValue());
    }

//    public String generatePastAerId(Long accountId, Year year, Integer yearsBefore) {
//        return generate(year.minusYears(yearsBefore),accountId);
//    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestType.AER);
    }

    @Override
    public String getPrefix() {
        return "MAR";
    }
}
