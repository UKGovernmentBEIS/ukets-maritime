package uk.gov.mrtm.api.workflow.request.flow.doe.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.ReportableEmissionsSaveParams;
import uk.gov.mrtm.api.reporting.service.ReportableEmissionsService;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.registry.service.SendRegistryUpdatedEventAddRequestActionService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class DoeUpdateReportableEmissionsService {

	private final RequestService requestService;
	private final ReportableEmissionsService reportableEmissionsService;
	private final SendRegistryUpdatedEventAddRequestActionService sendRegistryUpdatedEventAddRequestActionService;

	@Transactional
	public void updateReportableEmissions(String requestId) {
		final Request request = requestService.findRequestById(requestId);
		final DoeRequestPayload requestPayload = (DoeRequestPayload) request.getPayload();
		final DoeRequestMetadata metadata = (DoeRequestMetadata) request.getMetadata();
		final ReportableEmissionsSaveParams saveParams = ReportableEmissionsSaveParams.builder()
				.accountId(request.getAccountId())
				.year(metadata.getYear())
				.reportableEmissions(AerTotalReportableEmissions.builder()
					.totalEmissions(requestPayload.getDoe().getMaritimeEmissions().getTotalMaritimeEmissions()
						.getTotalReportableEmissions())
					.surrenderEmissions(requestPayload.getDoe().getMaritimeEmissions().getTotalMaritimeEmissions()
						.getSurrenderEmissions())
					.lessIslandFerryDeduction(requestPayload.getDoe().getMaritimeEmissions().getTotalMaritimeEmissions()
						.getSmallIslandFerryDeduction())
					.less5PercentIceClassDeduction(requestPayload.getDoe().getMaritimeEmissions().getTotalMaritimeEmissions()
						.getIceClassDeduction())
					.build()
				)
				.isExempted(metadata.isExempted())
				.isFromDoe(true)
				.build();

		ReportableEmissionsUpdatedSubmittedEventDetails eventDetails =
			reportableEmissionsService.saveReportableEmissions(saveParams);

		sendRegistryUpdatedEventAddRequestActionService.addRequestAction(request, eventDetails,
			request.getPayload().getRegulatorAssignee());
	}
}
