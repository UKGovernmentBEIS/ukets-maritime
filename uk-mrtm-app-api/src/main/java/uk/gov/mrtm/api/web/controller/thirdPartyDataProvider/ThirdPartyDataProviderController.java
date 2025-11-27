package uk.gov.mrtm.api.web.controller.thirdPartyDataProvider;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.web.constants.SwaggerApiInfo;
import uk.gov.mrtm.api.web.controller.exception.ErrorResponse;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.security.Authorized;
import uk.gov.netz.api.security.AuthorizedRole;
import uk.gov.netz.api.thirdpartydataprovider.domain.ThirdPartyDataProviderCreateDTO;
import uk.gov.netz.api.thirdpartydataprovider.domain.ThirdPartyDataProviderDTO;
import uk.gov.netz.api.thirdpartydataprovider.domain.ThirdPartyDataProvidersResponseDTO;
import uk.gov.netz.api.thirdpartydataprovider.service.ThirdPartyDataProviderOrchestrator;
import uk.gov.netz.api.thirdpartydataprovider.service.ThirdPartyDataProviderService;

import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.NO_CONTENT;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.OK;
import static uk.gov.netz.api.common.constants.RoleTypeConstants.REGULATOR;

@RestController
@Validated
@RequiredArgsConstructor
@Tag(name = "Third party data provider API")
@RequestMapping(path = "/v1.0/third-party-data-provider")
public class ThirdPartyDataProviderController {

    private final ThirdPartyDataProviderOrchestrator thirdPartyDataProviderOrchestrator;
    private final ThirdPartyDataProviderService thirdPartyDataProviderService;

    @PostMapping
    @Operation(summary = "Creates a new third party data provider")
    @ApiResponse(responseCode = "204", description = NO_CONTENT)
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.CREATE_THIRD_PARTY_DATA_PROVIDER_BAD_REQUEST,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized
    public ResponseEntity<Void> createThirdPartyDataProvider(
        @Parameter(hidden = true) AppUser appUser,
        @RequestBody @Valid @NotNull @Parameter(description = "The third party provider data details", required = true)
        ThirdPartyDataProviderCreateDTO thirdPartyDataProviderCreateDTO) {
        thirdPartyDataProviderOrchestrator.createThirdPartyDataProvider(appUser, thirdPartyDataProviderCreateDTO);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get all third party data providers")
    @ApiResponse(responseCode = "200", description = OK,
        content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, array = @ArraySchema(schema = @Schema(implementation = ThirdPartyDataProviderDTO.class))))
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = REGULATOR)
    public ResponseEntity<ThirdPartyDataProvidersResponseDTO> getAllThirdPartyDataProviders(
        @Parameter(hidden = true) AppUser appUser
    ) {
        return ResponseEntity.ok(thirdPartyDataProviderService.getAllThirdPartyDataProviders(appUser));
    }
}
