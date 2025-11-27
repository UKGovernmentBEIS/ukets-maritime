package uk.gov.mrtm.api.workflow.request.flow.doe.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeTotalMaritimeEmissions;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class DoePopulateRequestMetadataWithReportableEmissionsService {
	
	private final RequestService requestService;

	@Transactional
	public void updateRequestMetadata(String requestId) {
		final Request request = requestService.findRequestById(requestId);
		final DoeRequestPayload requestPayload = (DoeRequestPayload)request.getPayload();
		final DoeRequestMetadata metadata = (DoeRequestMetadata)request.getMetadata();
		final DoeTotalMaritimeEmissions totalMaritimeEmissions = requestPayload.getDoe().getMaritimeEmissions().getTotalMaritimeEmissions();
		metadata.setEmissions(AerTotalReportableEmissions.builder()
						.totalEmissions(totalMaritimeEmissions.getTotalReportableEmissions())
						.surrenderEmissions(totalMaritimeEmissions.getSurrenderEmissions())
						.lessVoyagesInNorthernIrelandDeduction(totalMaritimeEmissions.getLessVoyagesInNorthernIrelandDeduction())
				.build());
	}
}
