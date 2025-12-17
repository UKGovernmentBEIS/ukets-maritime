package uk.gov.mrtm.api.web.controller.account;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountUpdateDTO;
import uk.gov.mrtm.api.account.service.MrtmAccountUpdateService;
import uk.gov.mrtm.api.web.constants.SwaggerApiInfo;
import uk.gov.mrtm.api.web.controller.exception.ErrorResponse;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.security.Authorized;

import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.BAD_REQUEST;

@RestController
@RequestMapping(path = "/v1.0/mrtm/accounts/{accountId}")
@RequiredArgsConstructor
@Validated
@Tag(name = "Maritime account update")
public class MrtmAccountUpdateController {

    private final MrtmAccountUpdateService mrtmAccountUpdateService;

    @PutMapping
    @Operation(summary = "Update the maritime account")
    @ApiResponse(responseCode = "204", description = SwaggerApiInfo.NO_CONTENT)
    @ApiResponse(responseCode = "400", description = BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<Void> updateMaritimeAccount(
            @PathVariable("accountId") @Parameter(description = "The account id", required = true) Long accountId,
            @RequestBody @Valid @Parameter(description = "The account fields", required = true) MrtmAccountUpdateDTO mrtmAccountUpdateDTO,
            AppUser user) {
        mrtmAccountUpdateService.updateMaritimeAccount(accountId, mrtmAccountUpdateDTO, user);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
