package uk.gov.mrtm.api.web.controller.account;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusDTO;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryCreationDTO;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryListResponse;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusListResponse;
import uk.gov.mrtm.api.account.service.reportingstatus.AccountReportingStatusHistoryCreationService;
import uk.gov.mrtm.api.account.service.reportingstatus.AccountReportingStatusHistoryQueryService;
import uk.gov.mrtm.api.account.service.reportingstatus.AccountReportingStatusQueryService;
import uk.gov.mrtm.api.web.controller.exception.ErrorResponse;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.security.Authorized;

import java.time.Year;

import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.FORBIDDEN;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.NOT_FOUND;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.NO_CONTENT;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.OK;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.SUBMIT_REPORTING_STATUS_BAD_REQUEST;

@RestController
@RequestMapping(path = "/v1.0/accounts/reporting-status")
@RequiredArgsConstructor
@Validated
@Tag(name = "Account reporting status history")
public class AccountReportingStatusHistoryController {

    private final AccountReportingStatusHistoryQueryService queryService;

    private final AccountReportingStatusHistoryCreationService creationService;

    private final AccountReportingStatusQueryService accountReportingStatusQueryService;

    @GetMapping("/history")
    @Operation(summary = "Get reporting status history list for an account")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AccountReportingStatusHistoryListResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<AccountReportingStatusHistoryListResponse> getReportingStatusHistory(
            @RequestParam(value = "accountId") @Parameter(description = "The account Id", required = true) Long accountId) {
        return new ResponseEntity<>(queryService.getReportingStatusHistoryListResponse(accountId), HttpStatus.OK);
    }

    @GetMapping("/{accountId}")
    @Operation(summary = "Get the most recent reporting status history list for an account for all reporting years")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AccountReportingStatusHistoryListResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<AccountReportingStatusListResponse> getAllReportingStatuses(
            @PathVariable("accountId") @Parameter(description = "The account id", required = true) Long accountId,
            @RequestParam("page") @Parameter(description = "The page number starting from zero") @Min(value = 0, message = "{parameter.page.typeMismatch}") @NotNull(message = "{parameter.page.typeMismatch}") Integer page,
            @RequestParam("size") @Parameter(description = "The page size") @Min(value = 1, message = "{parameter.pageSize.typeMismatch}") @NotNull(message = "{parameter.pageSize.typeMismatch}") Integer pageSize) {
        return new ResponseEntity<>(accountReportingStatusQueryService.getAllReportingStatuses(accountId, page, pageSize), HttpStatus.OK);
    }

    @GetMapping("/{accountId}/{year}")
    @Operation(summary = "Get most recent reporting status history item for an account for a reporting year")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AccountReportingStatusHistoryListResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<AccountReportingStatusDTO> getReportingStatusByYear(
            @PathVariable("accountId") @Parameter(description = "The account id", required = true) Long accountId,
            @PathVariable("year") @Parameter(description = "The year of accounting status", required = true) Year year) {
        return new ResponseEntity<>(
                accountReportingStatusQueryService.getReportingStatusByYear(accountId, year),
                HttpStatus.OK);
    }

    @PostMapping("/{accountId}/{year}")
    @Operation(summary = "Submits an account reporting status")
    @ApiResponse(responseCode = "204", description = NO_CONTENT)
    @ApiResponse(responseCode = "400", description = SUBMIT_REPORTING_STATUS_BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#accountId")
    public ResponseEntity<Void> submitReportingStatus(
            AppUser appUser,
            @PathVariable("accountId") @Parameter(description = "The account id", required = true) Long accountId,
            @PathVariable("year") @Parameter(description = "The year of accounting status", required = true) Year year,
            @RequestBody @Valid @Parameter(description = "The account reporting status submit dto", required = true)
            AccountReportingStatusHistoryCreationDTO reportingStatusCreationDTO) {
        creationService.submitReportingStatus(accountId, reportingStatusCreationDTO, year, appUser);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
