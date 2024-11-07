var strSuccess = 'Save successfully.';
var strFail = 'Save fail.';
var strSuccessHdrColor = 'blue';
var strFailHdrColor = 'red';

var strDateFormat = "YYYY-MM-DD";
var strDateTimeFormat = "YYYY-MM-DD HH:mm:ss";

var strMandatory = "Mandatory fields.";
var strNumOnly = "Numbers only.";
var strInvalidEmail = "Invalid email.";
var strStrDtEndDt = "Start Date cannot be later than End Date";
var strStrDtEndDt_DateTime = "Start Date/Time cannot be later than End Date/Time";
var strEffDtExpDt = "Effective Date cannot be later than Expiry Date";
var strDuplicate = "Duplicate Record Found.";

var page = {
    HOME: 'HOME',
    STUDENT_LOAN_MASTER: 'STUDENT_LOAN_MASTER',
    LOAN_COLLECTION: 'LOAN_COLLECTION'
};

var mode = {
    ADD: 'ADD',
    EDIT: 'EDIT'
};

var preproCert = {
    totPgm: 'cardNoPgm',
    totPendScan: 'cardScanCert',
    totPendProc: 'cardProcessCert'
};

var postingJobType = {
    register: 1,
    revoke: 2
};

var postingStatus = {
    pending: 0,
    hashing: 1,
    hashingComplete: 2,
    hashingFail: 3,
    registerStart: 4,
    registerComplete: 5,
    registerFail: 6,
    generateReceipt: 7,
    generateReceiptComplete: 8,
    generateReceiptFail: 9,
    mergeCertificate: 13,
    mergeCertificateComplete: 14,
    mergeCertificateFail: 15,
    postSigningComplete: 16,
    postSigningFail: 17,
    revokeCertificate: 18,
    revokeCertificateComplete: 19,
    revokeCertificateFail: 20
};

var certStatus = {
    PendingVerification:0,
    Verified:1,
    DataError:2,
    MarkedRevoke:3,
    RegisteringInProgress:4,
    Registered:5,
    RegisterFailed:6,
    Revoked:7,
    RevokeFailed:8,
    EmailSent:9,
    EmailSendingFailed:10
}