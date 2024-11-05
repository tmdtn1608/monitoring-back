import dotenv from 'dotenv';
/**
 * 일반 상수 및 환경변수
 */
const CONST = {
    ENV_VERSION : '',
    API_PORT : 0,
    HTTPS_PORT : '',
    DB_PORT : 3306,
    DB_HOST : 'localhost',
    DB_USER : 'root',
    DB_PASS : '',
    DB_NAME : 'Monitoring',
    DB_POOL : 0,
    JWT_KEY : '',
    JWT_ALG : '',
    JWT_EXP_A : '',
    JWT_EXP_R : '',
    JWT_PUB : '',
    LOG_PATH : '',
    LOG_LEV : '',
    CRED_PATH : '',
    CRED_PROFILE : '',
    GENERAL_REGION : '',
    SSL_KEY : '',
    SSL_CERT : '',
};

/**
 * 히스토리 타입
 */
const HistoryType = {
    CLIENT_LOGIN : "Client login",
    CLIENT_LOGOUT : "Client logout",
    USER_LOGIN : "User login",
    USER_LOGOUT : "User logout",
    BLACK_ADDED : "Black process added",
    BLACK_REMOVED : "Black process removed",
    WHITE_ADDED : "White process added",
    WHITE_REMOVED : "White process removed",
    CMD_KILL_BLACK : "Execute kill process",
    AUTO_KILL_BLACK : "Auto kill process"
};

/**
 * 로그인 결과 - 미사용
 */
const LOGIN_RESULT = {
    ALREADY_LOGIN : "Already logined",
    LOGIN_SUCCESS : "Success",
    ID_NOT_EXIST : "Id not exist",
    PASSWORD_NOT_MATCHED : "Password not matched"
}

/**
 * 에러코드 - 미사용
 */
const ERROR_DESC = {

}

/**
 * 토큰타입 - 미사용
 */
const TokenType = {
    ACCESS: "Access",
    REFRESH: "Refresh",
    BOTH: "Both"
}
/**
 * 인증결과 - 미사용
 */
const ValidationType = {
    MATCHED: "Matched", /** 유효 */
    INVALID: "Invalid", /** 갱신필요 */
    EXPIRED: "Expired", /** 만료 */
    ILLEGAL: "Illegal"
}

/**
 * 인증값 유효성 확인 - 미사용
 * @param param 인증키
 * @returns 정상일 경우 true, 아니면 false
 */
const IsValidationType = (param : any) => {
    return Object.values(ValidationType).includes(param);
}

const VALIDATION_DATA_FORMAT = [
    's2isbe',
    'start',
    'nid',
    'plen',
    'mtype',
    's1_st',
    's1_val1',
    's1_val2',
    's2_st',
    's2_val1',
    's2_val2',
    'temp',
    'humi',
    'bat',
    'crc16',
    'last',
    'rdate',
    'gwid',
    'securecode'
];

function ConstInit() {
    dotenv.config();
    CONST.API_PORT = Number(process.env.API_PORT);
    // CONST.HTTPS_PORT = process.env.HTTPS_PORT as string;

    CONST.DB_PORT = Number(process.env.DB_PORT);
    CONST.DB_HOST = process.env.DB_HOST as string;
    CONST.DB_USER = process.env.DB_USER as string;
    CONST.DB_PASS = process.env.DB_PASS as string;
    CONST.DB_NAME = process.env.DB_NAME as string;
    CONST.DB_POOL = Number(process.env.DB_POOL);

    // CONST.JWT_KEY = process.env.JWT_KEY as string;
    // CONST.JWT_ALG = process.env.JWT_ALG as string;
    // CONST.JWT_EXP_A = process.env.JWT_EXP_A as string;
    // CONST.JWT_EXP_R = process.env.JWT_EXP_R as string;
    // CONST.JWT_PUB = process.env.JWT_PUB as string;

    // CONST.LOG_PATH = process.env.LOG_PATH as string;
    // CONST.LOG_LEV = process.env.LOG_LEV as string;

    // CONST.CRED_PATH = process.env.CRED_PATH as string;
    // CONST.CRED_PROFILE = process.env.CRED_PROFILE as string;
    // CONST.GENERAL_REGION = process.env.GENERAL_REGION as string;

    // CONST.SSL_KEY = process.env.SSL_KEY as string;
    // CONST.SSL_CERT = process.env.SSL_CERT as string;

    return true;
}

const CookieOption = {
    httpOnly: true,
    secure: true,
    SameSite: 'Strict',
    maxAge: ''
}

export {
    ConstInit,
    CONST,
    TokenType,
    ValidationType,
    IsValidationType,
    CookieOption,
    VALIDATION_DATA_FORMAT,
    LOGIN_RESULT,
    ERROR_DESC,
    HistoryType
};