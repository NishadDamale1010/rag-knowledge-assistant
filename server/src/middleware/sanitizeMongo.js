const logger = require("../utils/logger");

/**
 * Express 5-compatible NoSQL injection sanitizer.
 *
 * express-mongo-sanitize v2 crashes on Express 5 because req.query
 * is a read-only getter. This lightweight middleware sanitizes only
 * the mutable request properties (body, params) and logs blocked
 * attempts without touching req.query.
 */

const DANGEROUS_KEYS = /^\$/;
const DANGEROUS_VALUE = /\$/;

function sanitize(obj) {
    if (obj === null || typeof obj !== "object") return obj;

    for (const key of Object.keys(obj)) {
        if (DANGEROUS_KEYS.test(key)) {
            obj[key] = undefined;
            return { dirty: true, key };
        }

        const val = obj[key];

        if (typeof val === "string" && DANGEROUS_VALUE.test(val)) {
            obj[key] = val.replace(/\$/g, "_");
            return { dirty: true, key };
        }

        if (typeof val === "object" && val !== null) {
            const result = sanitize(val);
            if (result?.dirty) return result;
        }
    }

    return null;
}

const sanitizeMongo = (req, _res, next) => {
    for (const source of ["body", "params"]) {
        if (req[source] && typeof req[source] === "object") {
            const result = sanitize(req[source]);
            if (result?.dirty) {
                logger.warn("security", {
                    event: "nosql_injection_blocked",
                    key: result.key,
                    source,
                    path: req.originalUrl,
                });
            }
        }
    }
    next();
};

module.exports = sanitizeMongo;
