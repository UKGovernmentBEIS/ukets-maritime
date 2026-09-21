package uk.gov.mrtm.api.web.controller.thirdPartyDataProvider;

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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportCriteriaDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportResponseDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ThirdPartyDataManagementImportInitiatorService;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.service.ThirdPartyDataManagementViewAvailableToImportService;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.domain.ThirdPartyDataManagementTransactionDetailsResponseDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.service.ThirdPartyDataManagementViewTransactionDetailsService;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionsResponseDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.service.ThirdPartyDataManagementViewTransactionsService;
import uk.gov.mrtm.api.web.constants.SwaggerApiInfo;
import uk.gov.mrtm.api.web.controller.exception.ErrorResponse;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.domain.PagingRequest;
import uk.gov.netz.api.security.Authorized;
import uk.gov.netz.api.security.AuthorizedRole;

import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.NO_CONTENT;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.OK;
import static uk.gov.netz.api.common.constants.RoleTypeConstants.OPERATOR;

@RestController
@Validated
@RequiredArgsConstructor
@Tag(name = "Third party data management API")
@RequestMapping(path = "/v1.0/third-party-data-management")
public class ThirdPartyDataManagementController {

    private final ThirdPartyDataManagementViewAvailableToImportService thirdPartyDataManagementViewAvailableToImportService;
    private final ThirdPartyDataManagementViewTransactionsService thirdPartyDataManagementViewTransactionsService;
    private final ThirdPartyDataManagementViewTransactionDetailsService thirdPartyDataManagementViewTransactionDetailsService;
    private final ThirdPartyDataManagementImportInitiatorService thirdPartyDataManagementImportInitiatorService;

    @GetMapping("available-to-import")
    @Operation(summary = "Find all data available to import")
    @ApiResponse(responseCode = "200", description = OK,
        content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ThirdPartyDataManagementAvailableToImportResponseDTO.class)))
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = OPERATOR)
    public ResponseEntity<ThirdPartyDataManagementAvailableToImportResponseDTO> findDataAvailableToImport(
        @Parameter(hidden = true) AppUser user,
        @RequestParam("page") @Parameter(name = "page", description = "The page number starting from zero")
        @Min(value = 0, message = "{parameter.page.typeMismatch}")
        @NotNull(message = "{parameter.page.typeMismatch}") Integer page,
        @RequestParam("size") @Parameter(name = "size", description = "The page size")
        @Min(value = 1, message = "{parameter.pageSize.typeMismatch}")
        @NotNull(message = "{parameter.pageSize.typeMismatch}") Integer pageSize,
        @Valid
        @ModelAttribute
        @Parameter(description = "The third party data management search criteria")
        ThirdPartyDataManagementAvailableToImportCriteriaDTO searchCriteria
    ) {
        return ResponseEntity.ok(thirdPartyDataManagementViewAvailableToImportService.findDataAvailableToImport(user,
            PagingRequest.builder().pageNumber(page).pageSize(pageSize).build(),
            searchCriteria
            ));
    }

    @PostMapping("import")
    @Operation(summary = "Import data")
    @ApiResponse(responseCode = "204", description = NO_CONTENT)
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = OPERATOR)
    public ResponseEntity<Void> initiateImport(
        @Parameter(hidden = true) AppUser user,
        @RequestBody @Valid @Parameter(description = "The import details request DTO", required = true)
        ThirdPartyDataManagementImportRequestDTO requestDTO) {

        thirdPartyDataManagementImportInitiatorService.initiateImport(user, requestDTO);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("transactions")
    @Operation(summary = "Find all import data transactions")
    @ApiResponse(responseCode = "200", description = OK,
        content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ThirdPartyDataManagementTransactionsResponseDTO.class)))
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = OPERATOR)
    public ResponseEntity<ThirdPartyDataManagementTransactionsResponseDTO> findImportTransactions(
        @Parameter(hidden = true) AppUser user,
        @RequestParam("page") @Parameter(name = "page", description = "The page number starting from zero")
        @Min(value = 0, message = "{parameter.page.typeMismatch}")
        @NotNull(message = "{parameter.page.typeMismatch}") Integer page,
        @RequestParam("size") @Parameter(name = "size", description = "The page size")
        @Min(value = 1, message = "{parameter.pageSize.typeMismatch}")
        @NotNull(message = "{parameter.pageSize.typeMismatch}") Integer pageSize,
        @RequestParam(value = "direction", required = false, defaultValue = "DESC")
        @Parameter(name = "direction", description = "Sort direction for Date & time. Supported values: ASC, DESC. Defaults to DESC.")
        Sort.Direction direction
    ) {
        return ResponseEntity.ok(thirdPartyDataManagementViewTransactionsService
            .findImportTransactions(user, PageRequest.of(page, pageSize, Sort.by(direction, "createdOn"))));
    }

    @GetMapping("transaction-details/{transactionId}")
    @Operation(summary = "Find all jobs related to a transaction")
    @ApiResponse(responseCode = "200", description = OK,
        content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ThirdPartyDataManagementTransactionDetailsResponseDTO.class)))
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#transactionId")
    public ResponseEntity<ThirdPartyDataManagementTransactionDetailsResponseDTO> findImportTransactionDetails(
        @Parameter(hidden = true) AppUser user,
        @PathVariable("transactionId") @Parameter(name = "transactionId", description = "The transaction ID")
        @NotNull Long transactionId
    ) {
        return ResponseEntity.ok(thirdPartyDataManagementViewTransactionDetailsService.findImportTransactionDetails(user, transactionId));
    }
}
