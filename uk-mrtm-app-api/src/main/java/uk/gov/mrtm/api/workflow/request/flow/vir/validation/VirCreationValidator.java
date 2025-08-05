package uk.gov.mrtm.api.workflow.request.flow.vir.validation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirVerificationData;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirRequestIdGenerator;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.time.Year;
import java.util.Map;

@Validated
@Service
@RequiredArgsConstructor
public class VirCreationValidator {

    private final RequestQueryService requestQueryService;
    private final VirRequestIdGenerator virRequestIdGenerator;

    @Transactional
    public RequestCreateValidationResult validate(@NotNull @Valid final VirVerificationData verificationData,
                                                  final Long accountId,
                                                  final Year year) {

        final RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        // VIR exists
        final RequestParams params = RequestParams.builder()
                .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
                .requestMetadata(VirRequestMetadata.builder().type(MrtmRequestMetadataType.VIR).year(year).build())
                .build();
        
        final String requestId = virRequestIdGenerator.generate(params);
        final boolean virExists = requestQueryService.existsRequestById(requestId);

        if (virExists) {
            validationResult.setValid(false);
            validationResult.getReportedRequestTypes().add(MrtmRequestType.VIR);
        }
        
        return validationResult;
    }
}
