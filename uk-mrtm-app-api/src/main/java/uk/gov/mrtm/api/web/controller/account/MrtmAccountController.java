package uk.gov.mrtm.api.web.controller.account;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
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
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountDTO;
import uk.gov.mrtm.api.account.service.MrtmAccountCreateService;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.web.controller.exception.ErrorResponse;
import uk.gov.netz.api.security.AuthorizedRole;
import uk.gov.netz.api.account.domain.dto.AccountSearchCriteria;
import uk.gov.netz.api.account.domain.dto.AccountSearchResults;
import uk.gov.netz.api.account.service.AccountSearchServiceDelegator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.domain.PagingRequest;

import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.CREATED;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.CREATE_MARITIME_ACCOUNT_BAD_REQUEST;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.FORBIDDEN;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.OK;
import static uk.gov.netz.api.common.constants.RoleTypeConstants.OPERATOR;
import static uk.gov.netz.api.common.constants.RoleTypeConstants.REGULATOR;
import static uk.gov.netz.api.common.constants.RoleTypeConstants.VERIFIER;


@RestController
@Validated
@RequestMapping(path = "/v1.0/mrtm/accounts")
@RequiredArgsConstructor
@Tag(name = "Maritime accounts")
public class MrtmAccountController {

    private final MrtmAccountCreateService mrtmAccountCreateService;
    private final MrtmAccountQueryService mrtmAccountQueryService;
    private final AccountSearchServiceDelegator accountSearchServiceDelegator;

    @PostMapping
    @Operation(summary = "Creates a maritime account")
    @ApiResponse(responseCode = "201", description = CREATED)
    @ApiResponse(responseCode = "400", description = CREATE_MARITIME_ACCOUNT_BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = REGULATOR)
    public ResponseEntity<Void> createMaritimeAccount(
            @Parameter(hidden = true) AppUser appUser,
            @RequestBody @Valid @Parameter(description = "The maritime account creation dto", required = true)
            MrtmAccountDTO mrtmAccountDTO) {
        mrtmAccountCreateService.createMaritimeAccount(mrtmAccountDTO, appUser);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/imo-number/{imoNumber}")
    @Operation(summary = "Checks if maritime account IMO number exists")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = Boolean.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = REGULATOR)
    public ResponseEntity<Boolean> isExistingAccountImoNumber(
            @PathVariable("imoNumber") @NotBlank @Parameter(description = "The account IMO number", required = true) String imoNumber) {
        boolean exists = mrtmAccountQueryService.isExistingAccountImoNumber(imoNumber);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }

    @GetMapping
    @Operation(summary = "Retrieves the current user associated maritime accounts")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AccountSearchResults.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = {OPERATOR, REGULATOR, VERIFIER})
    public ResponseEntity<AccountSearchResults> searchCurrentUserMrtmAccounts (
            @Parameter(hidden = true) AppUser appUser,
            @RequestParam(value = "term", required = false) @Size(min = 3, max = 256) @Parameter(description = "The term to search") String term,
            @RequestParam(value = "page") @NotNull @Parameter(description = "The page number starting from zero") @Min(value = 0, message = "{parameter.page.typeMismatch}") Integer page,
            @RequestParam(value = "size") @NotNull @Parameter(description = "The page size") @Min(value = 1, message = "{parameter.pageSize.typeMismatch}")  Integer pageSize
    ) {
        return new ResponseEntity<>(
                accountSearchServiceDelegator.getAccountsByUserAndSearchCriteria(
                        appUser,
                        AccountSearchCriteria.builder()
                                .term(term)
                                .paging(PagingRequest.builder().pageNumber(page).pageSize(pageSize).build())
                                .sortBy(AccountSearchCriteria.SortBy.ACCOUNT_BUSINESS_ID)
                                .direction(Sort.Direction.ASC)
                                .build()), HttpStatus.OK);
    }
}
