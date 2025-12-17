package uk.gov.mrtm.api.web.controller.guidance;

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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.web.constants.SwaggerApiInfo;
import uk.gov.mrtm.api.web.controller.exception.ErrorResponse;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.guidance.sections.domain.dto.GuidanceSectionDTO;
import uk.gov.netz.api.guidance.sections.domain.dto.GuidanceSectionsResponseDTO;
import uk.gov.netz.api.guidance.sections.domain.dto.SaveGuidanceSectionDTO;
import uk.gov.netz.api.guidance.sections.service.GuidanceSectionService;
import uk.gov.netz.api.security.Authorized;
import uk.gov.netz.api.security.AuthorizedRole;

import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.BAD_REQUEST;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.CREATED;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.FORBIDDEN;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.INTERNAL_SERVER_ERROR;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.NOT_FOUND;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.OK;
import static uk.gov.netz.api.common.constants.RoleTypeConstants.OPERATOR;
import static uk.gov.netz.api.common.constants.RoleTypeConstants.REGULATOR;
import static uk.gov.netz.api.common.constants.RoleTypeConstants.VERIFIER;

@Validated
@RestController
@RequestMapping(path = "/v1.0/guidance-sections")
@RequiredArgsConstructor
@Tag(name = "Guidance sections")
public class GuidanceSectionController {

    private final GuidanceSectionService guidanceSectionService;

    @GetMapping
    @Operation(summary = "Retrieves all the guidance sections")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = GuidanceSectionsResponseDTO.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = {OPERATOR, REGULATOR, VERIFIER})
    public ResponseEntity<GuidanceSectionsResponseDTO> getGuidanceSections(@Parameter(hidden = true) AppUser authUser) {
        return new ResponseEntity<>(
        		guidanceSectionService.getGuidanceSections(authUser),
                HttpStatus.OK);
    }

    @GetMapping(path = "/{id}")
    @Operation(summary = "Get a guidance section")
    @ApiResponse(responseCode = "200", description = OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = GuidanceSectionDTO.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#id")
    public ResponseEntity<GuidanceSectionDTO> getGuidanceSectionById(@Parameter(hidden = true) AppUser authUser,
                                                                     @PathVariable("id") @Parameter(description = "The guidance section id", required = true) Long id) {
        final GuidanceSectionDTO guidanceSectionDTO = guidanceSectionService.getGuidanceSectionById(id, authUser);
        return new ResponseEntity<>(guidanceSectionDTO, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Creates a new guidance section")
    @ApiResponse(responseCode = "201", description = CREATED)
    @ApiResponse(responseCode = "400", description = BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized
    public ResponseEntity<Long> createGuidanceSection(@Parameter(hidden = true) AppUser authUser,
                                                      @RequestBody
                                                      @Valid
                                                      @Parameter(description = "The guidance section request", required = true)
                                                      SaveGuidanceSectionDTO saveGuidanceSectionDTO) {

        final Long guidanceSectionId = guidanceSectionService.createGuidanceSection(authUser, saveGuidanceSectionDTO);
        return new ResponseEntity<>(guidanceSectionId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a guidance section")
    @ApiResponse(responseCode = "200", description = OK)
    @ApiResponse(responseCode = "400", description = BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#id")
    public ResponseEntity<GuidanceSectionDTO> updateGuidanceSection(
            @Parameter(hidden = true) AppUser authUser,
            @PathVariable("id") @Parameter(description = "The guidance section id", required = true) Long id,
            @RequestBody @Valid @Parameter(description = "The guidance section request", required = true) SaveGuidanceSectionDTO saveGuidanceSectionDTO) {

        final GuidanceSectionDTO guidanceSectionDTO = guidanceSectionService.updateGuidanceSection(id, saveGuidanceSectionDTO, authUser);
        return new ResponseEntity<>(guidanceSectionDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a guidance section")
    @ApiResponse(responseCode = "200", description = OK)
    @ApiResponse(responseCode = "403", description = FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#id")
    public ResponseEntity<Void> deleteGuidanceSection(@PathVariable("id") @Parameter(description = "The guidance section id", required = true) Long id) {
        guidanceSectionService.deleteGuidanceSection(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
