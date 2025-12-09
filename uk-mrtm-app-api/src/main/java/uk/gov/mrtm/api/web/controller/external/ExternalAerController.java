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
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.integration.external.aer.domain.ExternalAer;
import uk.gov.mrtm.api.integration.external.aer.service.ExternalAerService;
import uk.gov.mrtm.api.web.constants.SwaggerApiInfo;
import uk.gov.mrtm.api.web.controller.exception.ExternalErrorResponse;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.security.Authorized;

import java.time.Year;

import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.NO_CONTENT;

@RestController
@Validated
@RequiredArgsConstructor
@Tag(name = "Maritime annual emissions report API")
@RequestMapping(path = "/external/v1.0/accounts")
@ConditionalOnProperty(name = "feature-flag.external.integration.aer.enabled", havingValue = "true")
public class ExternalAerController {

    private final ExternalAerService externalAerService;

    @PutMapping(path = "/{company-imo-number}/aer/{year}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Saves or updates maritime annual emissions report data")
    @ApiResponse(responseCode = "204", description = NO_CONTENT)
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.EXTERNAL_SAVE_AER_BAD_REQUEST,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.EXTERNAL_SAVE_AER_NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ExternalErrorResponse.class))})
    @Authorized(resourceId = "#companyImoNumber")
    public ResponseEntity<Void> submitAerData(
        @PathVariable("company-imo-number") @Parameter(name = "company-imo-number", description = "The company IMO number")
        @NotBlank @Pattern(regexp = "^\\d{7}$") String companyImoNumber,
        @PathVariable("year") @Parameter(description = "The year of the annual emissions report. Accepts the current year and possibly previous years with AER (based on the first year of maritime activity of the account)", required = true)
        @NotNull Year year,
        @RequestBody @Valid @NotNull @Parameter(description = "The annual emissions report data", required = true)
        ExternalAer aer,
        @Parameter(hidden = true) AppUser appUser) {

        externalAerService.submitAerData(aer, companyImoNumber, year, appUser);

        return ResponseEntity.noContent().build();
    }
}
