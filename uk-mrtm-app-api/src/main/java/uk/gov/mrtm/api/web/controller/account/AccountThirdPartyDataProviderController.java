package uk.gov.mrtm.api.web.controller.account;

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
import uk.gov.netz.api.account.service.AccountThirdPartyDataProviderAppointService;
import uk.gov.netz.api.account.service.AccountThirdPartyDataProviderService;
import uk.gov.netz.api.account.service.AccountThirdPartyDataProviderUnappointService;
import uk.gov.netz.api.security.Authorized;
import uk.gov.netz.api.thirdpartydataprovider.domain.ThirdPartyDataProviderNameInfoDTO;

import java.util.List;

@RestController
@RequestMapping(path = "/v1.0/accounts")
@RequiredArgsConstructor
@Tag(name = "Account third party data providers")
public class AccountThirdPartyDataProviderController {

    private final AccountThirdPartyDataProviderService accountThirdPartyDataProviderService;
    private final AccountThirdPartyDataProviderAppointService accountThirdPartyDataProviderAppointService;
    private final AccountThirdPartyDataProviderUnappointService accountThirdPartyDataProviderUnappointService;

    @GetMapping("/{id}/third-party-data-provider")
    @Operation(summary = "Get the third party data provider of the account (if exists)")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ThirdPartyDataProviderNameInfoDTO.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<ThirdPartyDataProviderNameInfoDTO> getThirdPartyDataProviderOfAccount(
        @PathVariable("id") @Parameter(description = "The account id", required = true) Long accountId) {
        return new ResponseEntity<>(
            accountThirdPartyDataProviderService.getThirdPartyDataProviderNameInfoByAccount(accountId).orElse(null),
            HttpStatus.OK);
    }

    @GetMapping(path = "/{id}/third-party-data-providers")
    @Operation(summary = "Get all third party data providers")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK,
        content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, array = @ArraySchema(schema = @Schema(implementation = ThirdPartyDataProviderNameInfoDTO.class))))
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<List<ThirdPartyDataProviderNameInfoDTO>> getAllThirdPartyDataProviders(
        @PathVariable("id") @Parameter(description = "The account id", required = true) Long accountId) {
        return new ResponseEntity<>(
            accountThirdPartyDataProviderService.getAllThirdPartyDataProviders(),
            HttpStatus.OK);
    }

    @PostMapping(path = "/{account-id}/appoint-third-party-data-provider/{third-party-data-provider-id}")
    @Operation(summary = "Appoint third party data provider to account")
    @ApiResponse(responseCode = "204", description = SwaggerApiInfo.NO_CONTENT)
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.APPOINT_THIRD_PARTY_DATA_PROVIDER_BAD_REQUEST,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<Void> appointThirdPartyDataProviderToAccount(
        @PathVariable("account-id") @Parameter(description = "The account id", required = true)
        Long accountId,
        @PathVariable("third-party-data-provider-id") @Parameter(description = "The third party data provider id to appoint to account", required = true)
        Long thirdPartyDataProviderId) {
        accountThirdPartyDataProviderAppointService.appointThirdPartyDataProviderToAccount(thirdPartyDataProviderId, accountId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping(path = "/{id}/unappoint-third-party-data-provider")
    @Operation(summary = "Unappoint third party data provider from account")
    @ApiResponse(responseCode = "204", description = SwaggerApiInfo.NO_CONTENT)
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.UNAPPOINT_THIRD_PARTY_DATA_PROVIDER_BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<Void> unappointThirdPartyDataProviderFromAccount(
        @PathVariable("id") @Parameter(description = "The account id to unappoint the third party data provider from", required = true)
        Long accountId) {
        accountThirdPartyDataProviderUnappointService.unappointAccountAppointedToThirdPartyDataProvider(accountId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
