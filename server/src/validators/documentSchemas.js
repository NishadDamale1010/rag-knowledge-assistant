const { z } = require("zod");

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid document ID");

const documentIdParam = z.object({
    id: objectId,
});

module.exports = { documentIdParam, objectId };
