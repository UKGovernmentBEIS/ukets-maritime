package uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service;

import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;

import java.util.Set;

public interface ThirdPartyDataManagementImportHandler {

	ThirdPartyDataManagementImportResult importData(long stagingDataId, String userId);

	void markInProgress(Set<Long> stagingIds);

	void markNotInProgress(Set<Long> stagingIds);

	Set<Long> createImportBatch(long transactionId, ThirdPartyDataManagementImportRequestDTO requestDTO);

	ThirdPartyDataRequestType getRequestType();

}
