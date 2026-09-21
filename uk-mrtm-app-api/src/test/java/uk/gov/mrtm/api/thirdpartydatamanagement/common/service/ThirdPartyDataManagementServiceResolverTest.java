package uk.gov.mrtm.api.thirdpartydatamanagement.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportResult;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ThirdPartyDataManagementImportHandler;

import java.util.ArrayList;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ThirdPartyDataManagementServiceResolverTest {

    @InjectMocks
    private ThirdPartyDataManagementServiceResolver resolver;

    @Spy
    private ArrayList<ThirdPartyDataManagementImportHandler> importServices;

    @Mock
    private TestThirdPartyDataManagementImportHandler testHandler;

    @Test
    void resolveImportService() {
        ThirdPartyDataRequestType requestType = mock(ThirdPartyDataRequestType.class);
        when(testHandler.getRequestType()).thenReturn(requestType);
        importServices.add(testHandler);
        ThirdPartyDataManagementImportHandler actual = resolver.resolveImportService(requestType);
        assertEquals(testHandler,  actual);
    }

    private static class TestThirdPartyDataManagementImportHandler implements ThirdPartyDataManagementImportHandler {


        @Override
        public ThirdPartyDataManagementImportResult importData(long stagingDataId, String userId) {
            return null;
        }

        @Override
        public void markInProgress(Set<Long> stagingIds) {

        }

        @Override
        public void markNotInProgress(Set<Long> stagingIds) {

        }

        @Override
        public Set<Long> createImportBatch(long transactionId, ThirdPartyDataManagementImportRequestDTO requestDTO) {
            return Set.of();
        }

        @Override
        public ThirdPartyDataRequestType getRequestType() {
            return null;
        }
    }
}