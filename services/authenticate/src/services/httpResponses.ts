const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
};

const response = (code, body) => {
    return {
        statusCode: code,
        headers: headers,
        body: JSON.stringify(body)
    };
};

const httpResponses = {
    ok: (body: any = {message: "Ok"}) => {
        return response(200, body);
    },
    requestError: (body: any = {message: "Request error"}) => {
        return response(400, body);
    },
    tokenError: (body: any = {message: "Wrong token"}) => {
        return response(404, body);
    },
    blocked: (body: any = {message: "User blocked"}) => {
        return response(403, body);
    },
    notFound: (body: any = {message: "Wrong token"}) => {
        return response(404, body);
    },
    mandatoryField: (body: any = {message: "Missing mandatory field"}) => {
        return response(409, body);
    },
    serverError: (body: any = {message: "Server error, please contact an admin"}) => {
        return response(500, body);
    }
};

export default httpResponses;
