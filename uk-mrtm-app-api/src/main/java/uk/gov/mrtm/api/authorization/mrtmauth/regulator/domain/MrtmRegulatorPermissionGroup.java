package uk.gov.mrtm.api.authorization.mrtmauth.regulator.domain;

import lombok.experimental.UtilityClass;

@UtilityClass
public class MrtmRegulatorPermissionGroup {
    public static final String REVIEW_EMP_APPLICATION = "REVIEW_EMP_APPLICATION";
    public static final String PEER_REVIEW_EMP_APPLICATION = "PEER_REVIEW_EMP_APPLICATION";
    public static final String SUBMIT_REVIEW_EMP_VARIATION = "SUBMIT_REVIEW_EMP_VARIATION";
    public static final String PEER_REVIEW_EMP_VARIATION = "PEER_REVIEW_EMP_VARIATION";
    public static final String REVIEW_EMP_NOTIFICATION = "REVIEW_EMP_NOTIFICATION";
    public static final String PEER_REVIEW_EMP_NOTIFICATION = "PEER_REVIEW_EMP_NOTIFICATION";
    public static final String SUBMIT_DOE = "SUBMIT_DOE";
    public static final String PEER_REVIEW_DOE = "PEER_REVIEW_DOE";
    public static final String REVIEW_AER = "REVIEW_AER";
    public static final String REVIEW_VIR = "REVIEW_VIR";
    public static final String SUBMIT_NON_COMPLIANCE = "SUBMIT_NON_COMPLIANCE";
    public static final String PEER_REVIEW_NON_COMPLIANCE = "PEER_REVIEW_NON_COMPLIANCE";
    public static final String SUBMIT_EMP_BATCH_REISSUE = "SUBMIT_EMP_BATCH_REISSUE";
    public static final String ANNUAL_IMPROVEMENT_REPORT = "ANNUAL_IMPROVEMENT_REPORT";
    public static final String ACCOUNT_CLOSURE = "ACCOUNT_CLOSURE";
}
