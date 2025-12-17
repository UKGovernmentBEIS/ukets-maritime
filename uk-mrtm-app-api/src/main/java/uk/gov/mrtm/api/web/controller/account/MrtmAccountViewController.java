package uk.gov.mrtm.api.web.controller.account;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountEmpDTO;
import uk.gov.mrtm.api.account.service.MrtmAccountViewService;
import uk.gov.mrtm.api.web.constants.SwaggerApiInfo;
import uk.gov.mrtm.api.web.controller.exception.ErrorResponse;
import uk.gov.netz.api.security.Authorized;

import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.FORBIDDEN;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.NOT_FOUND;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.OK;

@RestController
@Validated
@RequestMapping(path = "/v1.0/mrtm/accounts")
@RequiredArgsConstructor
@Tag(name = "Maritime accounts")
public class MrtmAccountViewController {

    private final MrtmAccountViewService mrtmAccountViewService;

    @GetMapping(path = "/{accountId}")
    @Operation(summary = "Get the maritime account")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = MrtmAccountEmpDTO.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<MrtmAccountEmpDTO> getMaritimeAccount(
            @PathVariable("accountId") @Parameter(description = "The account id", required = true) Long accountId) {
        return new ResponseEntity<>(mrtmAccountViewService.getMaritimeAccount(accountId), HttpStatus.OK);
    }
}
