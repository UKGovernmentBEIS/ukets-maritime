package uk.gov.mrtm.api.web.constants;

import lombok.experimental.UtilityClass;

/**
 * Encapsulates constants related to Swagger
 */
@UtilityClass
public final class SwaggerApiInfo {

    // Response Messages
    public static final String ERROR_CODES_HEADER = "\t\n Error Code | Description \t\n";
    public static final String FORM1001_ERROR_CODE = "FORM1001 | Form validation failed \t\n";
    public static final String EMAIL1001_ERROR_CODE = "EMAIL1001 | The verification link has expired \t\n";
    public static final String TOKEN1001_ERROR_CODE = "TOKEN1001 | Invalid Token \t\n";
    public static final String USER1003_ERROR_CODE = "USER1003 | User is already registered with different role \t\n";
    public static final String AUTHORITY1005_ERROR_CODE = "AUTHORITY1005 | User status cannot be updated \t\n";
    public static final String AUTHORITY1016_ERROR_CODE = "AUTHORITY1016 | Authority already exists for a different role type than operator \t\n";
    public static final String USER1001_ERROR_CODE = "USER1001 | User role already exists \t\n";
    public static final String FORM1002_ERROR_CODE = "FORM1002 | Parameters validation failed \t\n";
    public static final String NOTFOUND1001_ERROR_CODE = "NOTFOUND1001 | Resource not found \t\n";
    public static final String REQUEST_TASK_ACTION1000_ERROR_CODE = "REQUEST_TASK_ACTION1000 | Request task action cannot proceed \t\n";
    public static final String REQUEST_TASK_ACTION1001_ERROR_CODE = "REQUEST_TASK_ACTION1001 | User is not the assignee of the request task \t\n";
    public static final String ACCOUNT1009_ERROR_CODE = "ACCOUNT1009 | Account status is not valid \t\n";
    public static final String ITEM1001_ERROR_CODE = "ITEM1001 | Request task is not assignable \t\n";
    public static final String AUTHORITY1006_ERROR_CODE = "AUTHORITY1006 | User is not related to verification body \t\n";
    public static final String AUTHORITY1014_ERROR_CODE = "AUTHORITY1014 | Authority already exists for a different role type or CA \t\n";
    public static final String AUTHORITY1015_ERROR_CODE = "AUTHORITY1015 | Authority already exists for a different role type or VB \t\n";
    public static final String USER1004_ERROR_CODE = "USER1004 | User status is not valid \t\n";
    public static final String ACCOUNT1000_ERROR_CODE = "ACCOUNT1000 | User account does not belong to legal entity \t\n";
    public static final String ACCOUNT1002_ERROR_CODE = "ACCOUNT1002 | Legal entity name already exists for the user \t\n";
    public static final String PERMIT1001_ERROR_CODE = "PERMIT1001 | Permit is in invalid state \t\n";
    public static final String FILE1002_ERROR_CODE = "FILE1002 | File size is less than minimum \t\n";
    public static final String FILE1003_ERROR_CODE = "FILE1003 | File size is greater than maximum \t\n";
    public static final String AUTHORITY1001_ERROR_CODE = "AUTHORITY1001 | At least one operator admin should exist in account \t\n";
    public static final String AUTHORITY1004_ERROR_CODE = "AUTHORITY1004 | User is not related to account \t\n";
    public static final String AUTHORITY1008_ERROR_CODE = "AUTHORITY1008 | Authority status in not valid \t\n";
    public static final String AUTHORITY1003_ERROR_CODE = "AUTHORITY1003 | User is not related to competent authority \t\n";
    public static final String AUTHORITY1007_ERROR_CODE = "AUTHORITY1007 | Active verifier admin should exist \t\n";
    public static final String ACCOUNT1006_ERROR_CODE = "ACCOUNT1006 | A verification body has already been appointed to the account \t\n";
    public static final String ACCOUNT1008_ERROR_CODE = "ACCOUNT1008 | The verification body is not accredited to the account's emission trading scheme \t\n";
    public static final String ACCOUNT1010_ERROR_CODE = "ACCOUNT1010 | Verification body is attached on open tasks \t\n";
    public static final String THIRDPARTYDATAPROVIDER1002_ERROR_CODE = "THIRDPARTYDATAPROVIDER1002 | Third party data provider has already been appointed to the account \t\n";
    public static final String NOTIF1000_ERROR_CODE = "NOTIF1000 | Template processing failed \t\n";
    public static final String OTP1001_ERROR_CODE = "OTP1001 | Invalid OTP \t\n";
    public static final String USER1005_ERROR_CODE = "USER1005 | User not exist \t\n";
    public static final String AUTHORITY1013_ERROR_CODE = "AUTHORITY1013 | User is not verifier \t\n";
    public static final String NOTIF1001_ERROR_CODE = "NOTIF1001 | File does not exist for document template \t\n";
    public static final String OK = "OK";
    public static final String NO_CONTENT = "No Content";
    public static final String CREATED = "Created";
    public static final String BAD_REQUEST = "Bad Request";
    public static final String NOT_FOUND = "Not Found";
    public static final String FORBIDDEN = "Forbidden";
    public static final String INTERNAL_SERVER_ERROR = "Internal Server Error";
    public static final String SERVICE_UNAVAILABLE = "Service unavailable";
    public static final String VALIDATION_ERROR_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE;
    public static final String VALIDATION_PARAMETER_ERROR_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1002_ERROR_CODE;
    public static final String TOKEN_VERIFICATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        EMAIL1001_ERROR_CODE +
        TOKEN1001_ERROR_CODE;
    public static final String ACCEPT_AUTHORITY_AND_ENABLE_OPERATOR_USER_FROM_INVITATION_WITH_CREDENTIALS_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        EMAIL1001_ERROR_CODE +
        TOKEN1001_ERROR_CODE +
        USER1003_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE +
        AUTHORITY1016_ERROR_CODE +
        FORM1001_ERROR_CODE;
    public static final String USERS_TOKEN_VERIFICATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        USER1001_ERROR_CODE +
        EMAIL1001_ERROR_CODE +
        TOKEN1001_ERROR_CODE +
        FORM1001_ERROR_CODE;
    public static final String ACCEPT_OPERATOR_INVITATION_TOKEN_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        EMAIL1001_ERROR_CODE +
        TOKEN1001_ERROR_CODE +
        "USER1002 | User is deleted \t\n " +
        USER1003_ERROR_CODE +
        NOTFOUND1001_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE +
        "AUTHORITY1009 | User is not operator \t\n " +
        AUTHORITY1016_ERROR_CODE;
    public static final String ACCOUNT_LEGAL_ENTITY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        ACCOUNT1000_ERROR_CODE;
    public static final String REQUEST_ACTION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        "REQUEST_CREATE_ACTION1000 | Request create action not allowed \t\n " +
        ACCOUNT1000_ERROR_CODE +
        ACCOUNT1002_ERROR_CODE;
    public static final String REQUEST_TASK_ACTION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        FORM1002_ERROR_CODE +
        REQUEST_TASK_ACTION1000_ERROR_CODE +
        REQUEST_TASK_ACTION1001_ERROR_CODE +
        ACCOUNT1000_ERROR_CODE +
        "ACCOUNT1001 | Account name already exists for the user \t\n " +
        ACCOUNT1002_ERROR_CODE +
        ACCOUNT1009_ERROR_CODE +
        "ACCOUNT1015 | Account location doesn't exist \t\n " +
        PERMIT1001_ERROR_CODE +
        "PERMIT1002 | Invalid Permit review \t\n " +
        "PERMIT1003 | Invalid Permit \t\n " +
        "PERMIT1004 | Invalid Permit Variation Review \t\n " +
        "PERMITSURRENDER1001 | Invalid Permit surrender \t\n ";
    public static final String REQUEST_TASK_ASSIGNMENT_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "ITEM1000 | Can not assign request to the provided user \t\n" +
        ITEM1001_ERROR_CODE;
    public static final String REQUEST_TASK_UPLOAD_ATTACHMENT_ACTION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        PERMIT1001_ERROR_CODE +
        "FILE1001 | Virus found in input stream \t\n " +
        FILE1002_ERROR_CODE +
        FILE1003_ERROR_CODE +
        "FILE1004 | File upload failed";
    public static final String UPDATE_ACCOUNT_OPERATOR_AUTHORITY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "ROLE1000 | Invalid operator role code \t\n " +
        AUTHORITY1001_ERROR_CODE +
        AUTHORITY1004_ERROR_CODE +
        AUTHORITY1008_ERROR_CODE +
        "AUTHORITY1012 | User role can not be modified \t\n" +
        "ACCOUNT_CONTACT1001 | You must have a primary contact on your account \t\n" +
        "ACCOUNT_CONTACT1002 | You must have a financial contact on your account \t\n" +
        "ACCOUNT_CONTACT1003 | You must have a service contact on your account \t\n" +
        "ACCOUNT_CONTACT1004 | You cannot assign the same user as a primary and secondary contact on your account \t\n" +
        "ACCOUNT_CONTACT1005 | You cannot assign a Restricted user as primary contact on your account \t\n" +
        "ACCOUNT_CONTACT1006 | You cannot assign a Restricted user as secondary contact on your account";
    public static final String AUTHORITY_USER_NOT_RELATED_TO_CA = BAD_REQUEST + ERROR_CODES_HEADER +
        AUTHORITY1003_ERROR_CODE;
    public static final String AUTHORITY_USER_NOT_RELATED_TO_ACCOUNT = BAD_REQUEST + ERROR_CODES_HEADER +
        AUTHORITY1004_ERROR_CODE;
    public static final String AUTHORITY_USER_NOT_RELATED_TO_VERIFICATION_BODY = BAD_REQUEST + ERROR_CODES_HEADER +
        AUTHORITY1006_ERROR_CODE;
    public static final String UPDATE_REGULATOR_USER_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        AUTHORITY1003_ERROR_CODE +
        "INVALID_IMAGE_DIMENSIONSIMAGE1001 | Image dimensions are not valid \t\n " +
        FILE1002_ERROR_CODE +
        FILE1003_ERROR_CODE +
        "FILE1005 | File type is not accepted \t\n " +
        FORM1001_ERROR_CODE;
    public static final String OPERATOR_USER_ACCOUNT_REGISTRATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE +
        "AUTHORITY1011 | Regulator user can only add operator administrator users to an account \t\n " +
        AUTHORITY1016_ERROR_CODE +
        "USER1000 | User registration failed \t\n " +
        USER1003_ERROR_CODE;
    public static final String DELETE_ACCOUNT_OPERATOR_AUTHORITY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        AUTHORITY1001_ERROR_CODE +
        AUTHORITY1004_ERROR_CODE;
    public static final String UPDATE_VERIFIER_AUTHORITY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        AUTHORITY1007_ERROR_CODE +
        AUTHORITY1008_ERROR_CODE;
    public static final String INVITE_REGULATOR_USER_TO_CA_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        USER1001_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE +
        AUTHORITY1014_ERROR_CODE;
    public static final String ACCEPT_REGULATOR_USER_INVITATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        EMAIL1001_ERROR_CODE +
        TOKEN1001_ERROR_CODE +
        USER1004_ERROR_CODE+
        USER1001_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE +
        AUTHORITY1014_ERROR_CODE;
    public static final String ACCEPT_AUTHORITY_AND_ENABLE_REGULATOR_USER_FROM_INVITATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        EMAIL1001_ERROR_CODE +
        TOKEN1001_ERROR_CODE +
        USER1001_ERROR_CODE +
        USER1004_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE +
        AUTHORITY1014_ERROR_CODE;
    public static final String ACCEPT_AUTHORITY_REGULATOR_USER_FROM_INVITATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        EMAIL1001_ERROR_CODE +
        TOKEN1001_ERROR_CODE +
        USER1004_ERROR_CODE;
    public static final String INVITE_VERIFIER_USER_TO_VB_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        USER1001_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE +
        AUTHORITY1015_ERROR_CODE;
    public static final String ACCEPT_VERIFIER_USER_INVITATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        EMAIL1001_ERROR_CODE +
        TOKEN1001_ERROR_CODE +
        USER1001_ERROR_CODE +
        USER1004_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE +
        AUTHORITY1015_ERROR_CODE;
    public static final String ACCEPT_AUTHORITY_AND_ENABLE_VERIFIER_USER_FROM_INVITATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        EMAIL1001_ERROR_CODE +
        TOKEN1001_ERROR_CODE +
        USER1001_ERROR_CODE +
        USER1004_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE +
        AUTHORITY1015_ERROR_CODE;
    public static final String UPDATE_CA_SITE_CONTACTS_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        AUTHORITY1003_ERROR_CODE +
        "ACCOUNT1004 | Account is not related to competent authority \t\n " +
        FORM1001_ERROR_CODE;
    public static final String UPDATE_VB_SITE_CONTACTS_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        AUTHORITY1006_ERROR_CODE +
        "ACCOUNT1005 | Account is not related to verification body \t\n " +
        FORM1001_ERROR_CODE;
    public static final String APPOINT_VERIFICATION_BODY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        ACCOUNT1006_ERROR_CODE +
        ACCOUNT1008_ERROR_CODE +
        ACCOUNT1009_ERROR_CODE +
        ACCOUNT1010_ERROR_CODE +
        NOTIF1000_ERROR_CODE +
        NOTFOUND1001_ERROR_CODE +
        FORM1001_ERROR_CODE;
    public static final String REAPPOINT_VERIFICATION_BODY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        ACCOUNT1006_ERROR_CODE +
        "ACCOUNT1007 | A verification body has not been appointed to the account \t\n " +
        ACCOUNT1009_ERROR_CODE +
        ACCOUNT1008_ERROR_CODE +
        ACCOUNT1010_ERROR_CODE +
        NOTIF1000_ERROR_CODE +
        NOTFOUND1001_ERROR_CODE +
        FORM1001_ERROR_CODE;
    public static final String UNAPPOINT_VERIFICATION_BODY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        NOTIF1000_ERROR_CODE +
        NOTFOUND1001_ERROR_CODE +
        FORM1001_ERROR_CODE;
    public static final String CREATE_VERIFICATION_BODY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        USER1001_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE;
    public static final String UPDATE_VERIFICATION_BODY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        "VERBODY1001 | Accreditation reference number already exists ";
    public static final String INVITE_ADMIN_VERIFIER_TO_VB_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        "VERBODY1003 | Verification body status is not valid \t\n " +
        NOTFOUND1001_ERROR_CODE +
        USER1001_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE +
        AUTHORITY1015_ERROR_CODE;
    public static final String ACCEPT_AUTHORITY_AND_ENABLE_OPERATOR_USER_FROM_INVITATION_WOUT_CREDENTIALS_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        EMAIL1001_ERROR_CODE +
        TOKEN1001_ERROR_CODE +
        USER1003_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE +
        AUTHORITY1016_ERROR_CODE +
        FORM1001_ERROR_CODE;
    public static final String UPDATE_VERIFICATION_BODY_STATUS_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        "VERBODY1002 | Verification body status is not valid";
    public static final String SET_CREDENTIALS_TO_REGISTERED_OPERATOR_USER_FROM_INVITATION_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        USER1003_ERROR_CODE +
        USER1004_ERROR_CODE +
        AUTHORITY1005_ERROR_CODE +
        AUTHORITY1016_ERROR_CODE +
        EMAIL1001_ERROR_CODE +
        TOKEN1001_ERROR_CODE +
        FORM1001_ERROR_CODE;
    public static final String REQUEST_TO_CHANGE_2FA_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        OTP1001_ERROR_CODE +
        FORM1001_ERROR_CODE;
    public static final String REMOVE_2FA_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        TOKEN1001_ERROR_CODE +
        EMAIL1001_ERROR_CODE +
        USER1005_ERROR_CODE +
        FORM1001_ERROR_CODE;
    public static final String REQUEST_RESET_PASSWORD_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
         OTP1001_ERROR_CODE +
         FORM1001_ERROR_CODE;
    public static final String RESET_PASSWORD_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
         TOKEN1001_ERROR_CODE +
         USER1005_ERROR_CODE +
         USER1004_ERROR_CODE +
         OTP1001_ERROR_CODE +
         FORM1001_ERROR_CODE;
    public static final String DELETE_CURRENT_VERIFIER_AUTHORITY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        AUTHORITY1006_ERROR_CODE +
        AUTHORITY1007_ERROR_CODE;
    public static final String DELETE_VERIFIER_AUTHORITY_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        AUTHORITY1013_ERROR_CODE +
        AUTHORITY1006_ERROR_CODE +
        AUTHORITY1007_ERROR_CODE;
    public static final String GET_VERIFIER_USER_BY_ID_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        AUTHORITY1013_ERROR_CODE +
        AUTHORITY1006_ERROR_CODE;
    public static final String UPDATE_VERIFIER_USER_BY_ID_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        AUTHORITY1013_ERROR_CODE +
        AUTHORITY1006_ERROR_CODE;
    public static final String REQUEST_TASK_CANDIDATE_ASSIGNEES_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        ITEM1001_ERROR_CODE;
    public static final String REQUEST_TASK_TYPE_CANDIDATE_ASSIGNEES_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        ITEM1001_ERROR_CODE;
    public static final String GET_DOCUMENT_TEMPLATE_BY_ID_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        NOTIF1001_ERROR_CODE;
    public static final String UPDATE_DOCUMENT_TEMPLATE_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        NOTIF1001_ERROR_CODE;
    public static final String REQUEST_TASK_CREATE_CARD_PAYMENT_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        REQUEST_TASK_ACTION1000_ERROR_CODE +
        REQUEST_TASK_ACTION1001_ERROR_CODE +
        "PAYMENT1002 | Payment method is not valid";
    public static final String REQUEST_TASK_PROCESS_EXISTING_CARD_PAYMENT_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        REQUEST_TASK_ACTION1000_ERROR_CODE +
        REQUEST_TASK_ACTION1001_ERROR_CODE +
        "PAYMENT1003 | Payment id does not exist";
    public static final String MI_REPORT_REQUEST_TYPE_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        "MIREPORT1000 | Invalid MI Report type";
    public static final String GET_COMPANY_PROFILE_SERVICE_UNAVAILABLE = SERVICE_UNAVAILABLE + ERROR_CODES_HEADER +
        "COMPANYINFO1001 | Companies House API is currently unavailable";
    public static final String SUBMIT_REPORTING_STATUS_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        "ACCOUNT1012 | Enter a different reporting status";
    public static final String CREATE_MARITIME_ACCOUNT_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        "ACCOUNT1011 | Enter a different company IMO number. This one is already in use.";
    public static final String EXTERNAL_SAVE_EMP_BAD_REQUEST = BAD_REQUEST + "\t\n" + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        FORM1002_ERROR_CODE +
        "EMP1001 | Business validation error";
    public static final String EXTERNAL_SAVE_AER_BAD_REQUEST = BAD_REQUEST + "\t\n" + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        FORM1002_ERROR_CODE +
        "AER1004 | Business validation error";
    public static final String CREATE_THIRD_PARTY_DATA_PROVIDER_BAD_REQUEST = BAD_REQUEST + "\t\n" + ERROR_CODES_HEADER +
        FORM1001_ERROR_CODE +
        "THIRDPARTYDATAPROVIDER1000 | Third party data provider name already exists" +
        "THIRDPARTYDATAPROVIDER1001 | Third party data provider JWKS url already exists";
    public static final String APPOINT_THIRD_PARTY_DATA_PROVIDER_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        ACCOUNT1009_ERROR_CODE +
        NOTFOUND1001_ERROR_CODE +
        THIRDPARTYDATAPROVIDER1002_ERROR_CODE;
    public static final String UNAPPOINT_THIRD_PARTY_DATA_PROVIDER_BAD_REQUEST = BAD_REQUEST + ERROR_CODES_HEADER +
        NOTFOUND1001_ERROR_CODE;
}
