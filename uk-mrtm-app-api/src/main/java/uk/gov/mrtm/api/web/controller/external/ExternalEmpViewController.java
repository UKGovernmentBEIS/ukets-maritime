package uk.gov.mrtm.api.web.controller.external;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.integration.external.emp.domain.ExternalEmissionsMonitoringPlanDetails;
import uk.gov.mrtm.api.integration.external.emp.service.ExternalEmpViewService;
import uk.gov.mrtm.api.web.constants.SwaggerApiInfo;
import uk.gov.mrtm.api.web.controller.exception.ExternalErrorResponse;
import uk.gov.netz.api.security.Authorized;

@RestController
@Validated
@RequiredArgsConstructor
@Tag(name = "Maritime latest emissions monitoring plan API")
@RequestMapping(path = "/external/v1.0/accounts")
@ConditionalOnProperty(name = "feature-flag.external.integration.emp.view.enabled", havingValue = "true")
public class ExternalEmpViewController {

    private final ExternalEmpViewService externalEmpViewService;

    @GetMapping(path = "/{company-imo-number}/emp")
    @Operation(summary = "Gets the latest submitted data for the maritime emissions monitoring plan")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalEmissionsMonitoringPlanDetails.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.EXTERNAL_GET_EMP_NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalErrorResponse.class))})
    @Authorized(resourceId = "#companyImoNumber")
    public ResponseEntity<ExternalEmissionsMonitoringPlanDetails> getLatestEmissionsMonitoringPlanData(
        @PathVariable("company-imo-number") @Parameter(name = "company-imo-number", description = "The company IMO number")
        @NotBlank @Pattern(regexp = "^\\d{7}$") String companyImoNumber) {

        ExternalEmissionsMonitoringPlanDetails emissionsMonitoringPlanData =
            externalEmpViewService.getLatestEmissionsMonitoringPlanData(companyImoNumber);

        return ResponseEntity.ok(emissionsMonitoringPlanData);
    }
}
