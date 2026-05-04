package uk.gov.mrtm.api.workflow.request.flow.registry.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;
import uk.gov.mrtm.api.workflow.request.flow.registry.domain.RegistryAccountUpdatedEventSubmittedRequestActionPayload;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.integration.model.account.AccountUpdatingEvent;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AccountUpdatedRequestActionMapper {

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "organisationStructure", source = "organisationStructure")
    RegistryAccountUpdatedEventSubmittedRequestActionPayload map(AccountUpdatingEvent data,
                                                                 OrganisationStructure organisationStructure,
                                                                 String payloadType);
}
