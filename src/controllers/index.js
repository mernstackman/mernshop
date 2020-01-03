class global {
    static initApiResults(req, res, next) {
        req.apiResults = {};
        next();
    }

    /* For testing purpose only */
    static testApi(req, res, next) {
        console.log(req.body, req.apiResults);
        next();
    }
}

export default global;
