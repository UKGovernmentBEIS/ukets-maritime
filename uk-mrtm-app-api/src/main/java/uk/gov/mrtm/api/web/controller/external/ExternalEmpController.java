package uk.gov.mrtm.api.web.controller.external;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.integration.external.emp.domain.ExternalEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.service.ExternalEmpService;
import uk.gov.mrtm.api.web.constants.SwaggerApiInfo;
import uk.gov.mrtm.api.web.controller.exception.ExternalErrorResponse;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.security.Authorized;

import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.NO_CONTENT;

@RestController
@Validated
@RequiredArgsConstructor
@Tag(name = "Maritime emissions monitoring plan API")
@RequestMapping(path = "/external/v1.0/accounts")
public class ExternalEmpController {

    private final ExternalEmpService externalEmpService;

    @PutMapping(path = "/{company-imo-number}/emp", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Saves or updates maritime emissions monitoring plan data")
    @ApiResponse(responseCode = "204", description = NO_CONTENT)
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.EXTERNAL_SAVE_EMP_BAD_REQUEST,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalErrorResponse.class))})
    @Authorized(resourceId = "#companyImoNumber")
    public ResponseEntity<Void> submitEmissionsMonitoringPlanData (
        @PathVariable("company-imo-number") @Parameter(name = "company-imo-number", description = "The company IMO number")
        @NotBlank @Pattern(regexp = "^\\d{7}$") String companyImoNumber,
        @RequestBody @Valid @NotNull @Parameter(description = "The emissions monitoring plan data", required = true)
        ExternalEmissionsMonitoringPlan emissionsMonitoringPlan,
        @Parameter(hidden = true) AppUser appUser) {

        externalEmpService.submitEmissionsMonitoringPlanData(emissionsMonitoringPlan,  companyImoNumber, appUser);

        return ResponseEntity.noContent().build();
    }
}
