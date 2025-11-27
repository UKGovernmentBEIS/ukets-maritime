package uk.gov.mrtm.api.workflow.request.flow.aer.verify.handler;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.mapper.AerVerifyMapper;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.verificationbody.service.VerificationBodyDetailsQueryService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.HashMap;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AerApplicationVerificationSubmitInitializer implements InitializeRequestTaskHandler {

    private final VerificationBodyDetailsQueryService verificationBodyDetailsQueryService;
    private static final AerVerifyMapper MAPPER = Mappers.getMapper(AerVerifyMapper.class);

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        final AerRequestMetadata requestMetadata = (AerRequestMetadata) request.getMetadata();
        final AerRequestPayload requestPayload = (AerRequestPayload) request.getPayload();

        final Long requestVBId = request.getVerificationBodyId();
        final Long verificationReportVBId = Optional.ofNullable(requestPayload.getVerificationReport())
				.map(AerVerificationReport::getVerificationBodyId).orElse(null);

        //  If VB id is changed clear verification report from request
 		if(isVbChanged(requestVBId, verificationReportVBId)) {
 			requestPayload.setVerificationReport(null);
            requestPayload.setVerificationSectionsCompleted(new HashMap<>());
 		}

        final AerVerificationReport latestVerificationReport = AerVerificationReport.builder()
        		.verificationBodyId(requestVBId)
                .verificationBodyDetails(verificationBodyDetailsQueryService.getVerificationBodyDetails(requestVBId).
                        orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, requestVBId)))
                .verificationData(isVbChanged(requestVBId, verificationReportVBId)
    					? AerVerificationData.builder().build()
    					: requestPayload.getVerificationData())
                .build();

        // if smf not exist, reset the respective verification property in the request
        // task (request payload will be updated as well due to by-reference behavior)
        if (BooleanUtils.isFalse(requestPayload.getAer().getSmf().getExist()) &&
            latestVerificationReport.getVerificationData() != null) {

            latestVerificationReport.getVerificationData().setEmissionsReductionClaimVerification(null);
            requestPayload.getVerificationSectionsCompleted().keySet().removeIf(entry -> entry.equals("emissionsReductionClaimsVerification"));
        }

        return MAPPER.toAerApplicationVerificationSubmitRequestTaskPayload(
            requestPayload,
            latestVerificationReport,
            requestMetadata.getYear(),
            MrtmRequestTaskPayloadType.AER_APPLICATION_VERIFICATION_SUBMIT_PAYLOAD
        );
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(
            MrtmRequestTaskType.AER_APPLICATION_VERIFICATION_SUBMIT,
            MrtmRequestTaskType.AER_AMEND_APPLICATION_VERIFICATION_SUBMIT
        );
    }

    private boolean isVbChanged(Long requestVBId, Long verificationReportVBId) {
    	return !requestVBId.equals(verificationReportVBId);
    }
}
