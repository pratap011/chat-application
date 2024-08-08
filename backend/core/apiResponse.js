class ApiResponse{
    constructor(statusCode,status,message){
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
    }

    prepare(res,response,headers={}){
        for(const [key,value] of Object.entries(headers)){
            res.append(key,value);
        }
        return res.status(this.status).json(ApiResponse.sanitize(response));
    }
    send(res, headers = {}) {
        return this.prepare(res, this, headers);
      }


    static sanitize(response){
        const clone={...response};
        delete clone.status;
        for(const key in clone){
            if(typeof clone[key]==='undefined'){
                delete clone[key];
            }
        }
        return clone;
    }

}


class AuthFailureResponse extends ApiResponse{
    constructor(message='Authentication failure'){
        super('1001',401,message);
    }
}


class NotFoundResponse extends ApiResponse {
    constructor(message = 'Not Found') {
      super('10001', 404, message);
    }
  
    send(res, headers = {}) {
      return super.prepare(res, this, headers);
    }
  }
  

  class ForbiddenResponse extends ApiResponse {
    constructor(message = 'Forbidden') {
      super('10001', 403, message);
    }
  }
  
  class BadRequestResponse extends ApiResponse {
    constructor(message = 'Bad Parameters') {
      super('10001', 400, message);
    }
  }
  
  class InternalErrorResponse extends ApiResponse {
    constructor(message = 'Internal Error') {
      super('10001', 500, message);
    }
  }
  
  class SuccessMsgResponse extends ApiResponse {
    constructor(message) {
      super('10000', 200, message);
    }
  }
  
  class FailureMsgResponse extends ApiResponse {
    constructor(message) {
      super('10001', 200, message);
    }
  }
  
  class SuccessResponse extends ApiResponse {
    constructor(message, data) {
      super('10000', 200, message);
      this.data = data;
    }
  
    send(res, headers = {}) {
      return super.prepare(res, this, headers);
    }
  }
  
  class AccessTokenErrorResponse extends ApiResponse {
    constructor(message = 'Access token invalid') {
      super('10003', 401, message);
      this.instruction = 'refresh_token';
    }
  
    send(res, headers = {}) {
      headers.instruction = this.instruction;
      return super.prepare(res, this, headers);
    }
  }
  
  class TokenRefreshResponse extends ApiResponse {
    constructor(message, accessToken, refreshToken) {
      super('10000', 200, message);
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    }
  
    send(res, headers = {}) {
      return super.prepare(res, this, headers);
    }
  }
  
  module.exports = {
    ApiResponse,
    AuthFailureResponse,
    NotFoundResponse,
    ForbiddenResponse,
    BadRequestResponse,
    InternalErrorResponse,
    SuccessMsgResponse,
    FailureMsgResponse,
    SuccessResponse,
    AccessTokenErrorResponse,
    TokenRefreshResponse,
  };