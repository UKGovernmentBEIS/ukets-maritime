package uk.gov.mrtm.api.web.controller.verificationbody;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.web.constants.SwaggerApiInfo;
import uk.gov.mrtm.api.web.controller.exception.ErrorResponse;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.security.Authorized;
import uk.gov.netz.api.security.AuthorizedRole;
import uk.gov.netz.api.thirdpartydataprovider.domain.ThirdPartyDataProviderNameInfoDTO;
import uk.gov.netz.api.verificationbody.service.thirdpartydataprovider.VerificationBodyThirdPartyDataProviderAppointService;
import uk.gov.netz.api.verificationbody.service.thirdpartydataprovider.VerificationBodyThirdPartyDataProviderService;
import uk.gov.netz.api.verificationbody.service.thirdpartydataprovider.VerificationBodyThirdPartyDataProviderUnappointService;

import java.util.List;

import static uk.gov.netz.api.common.constants.RoleTypeConstants.VERIFIER;

@RestController
@RequestMapping(path = "/v1.0/verification-bodies")
@RequiredArgsConstructor
@Tag(name = "Verification body third party data providers")
public class VerificationBodyThirdPartyDataProviderController {

    private final VerificationBodyThirdPartyDataProviderService verificationBodyThirdPartyDataProviderService;
    private final VerificationBodyThirdPartyDataProviderAppointService verificationBodyThirdPartyDataProviderAppointService;
    private final VerificationBodyThirdPartyDataProviderUnappointService verificationBodyThirdPartyDataProviderUnappointService;

    @GetMapping("/third-party-data-provider")
    @Operation(summary = "Get the third party data provider of the verification body (if exists)")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ThirdPartyDataProviderNameInfoDTO.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = VERIFIER)
    public ResponseEntity<ThirdPartyDataProviderNameInfoDTO> getThirdPartyDataProviderOfVerificationBody(
        @Parameter(hidden = true) AppUser appUser
    ) {
        return new ResponseEntity<>(
            verificationBodyThirdPartyDataProviderService.getThirdPartyDataProviderNameInfoByVerificationBody(appUser.getVerificationBodyId()).orElse(null),
            HttpStatus.OK);
    }

    @GetMapping("/{id}/third-party-data-provider")
    @Operation(summary = "Get the third party data provider of the verification body (if exists)")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ThirdPartyDataProviderNameInfoDTO.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized
    public ResponseEntity<ThirdPartyDataProviderNameInfoDTO> getThirdPartyDataProviderOfVerificationBodyById(
        @Parameter(description = "The verification body id") @PathVariable("id") Long verificationBodyId
    ) {
        return new ResponseEntity<>(
            verificationBodyThirdPartyDataProviderService.getThirdPartyDataProviderNameInfoByVerificationBody(verificationBodyId).orElse(null),
            HttpStatus.OK);
    }

    @GetMapping(path = "/third-party-data-providers")
    @Operation(summary = "Get all third party data providers for the verification body")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK,
        content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, array = @ArraySchema(schema = @Schema(implementation = ThirdPartyDataProviderNameInfoDTO.class))))
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized
    public ResponseEntity<List<ThirdPartyDataProviderNameInfoDTO>> getAllThirdPartyDataProvidersForVerificationBody() {
        return new ResponseEntity<>(
            verificationBodyThirdPartyDataProviderService.getAllThirdPartyDataProviders(),
            HttpStatus.OK);
    }

    @PostMapping(path = "/appoint-third-party-data-provider/{third-party-data-provider-id}")
    @Operation(summary = "Appoint third party data provider to verification body")
    @ApiResponse(responseCode = "204", description = SwaggerApiInfo.NO_CONTENT)
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.APPOINT_THIRD_PARTY_DATA_PROVIDER_BAD_REQUEST,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized
    public ResponseEntity<Void> appointThirdPartyDataProviderToVerificationBody(
        @Parameter(hidden = true) AppUser appUser,
        @PathVariable("third-party-data-provider-id") @Parameter(description = "The third party data provider id to appoint to verification body", required = true)
        Long thirdPartyDataProviderId) {
        verificationBodyThirdPartyDataProviderAppointService.appointThirdPartyDataProviderToVerificationBody(thirdPartyDataProviderId, appUser.getVerificationBodyId());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping(path = "/unappoint-third-party-data-provider")
    @Operation(summary = "Unappoint third party data provider from the verification body")
    @ApiResponse(responseCode = "204", description = SwaggerApiInfo.NO_CONTENT)
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.UNAPPOINT_THIRD_PARTY_DATA_PROVIDER_BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized
    public ResponseEntity<Void> unappointThirdPartyDataProviderFromVerificationBody(
        @Parameter(hidden = true) AppUser appUser) {
        verificationBodyThirdPartyDataProviderUnappointService.unappointThirdPartyDataProviderFromVerificationBody(appUser.getVerificationBodyId());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
