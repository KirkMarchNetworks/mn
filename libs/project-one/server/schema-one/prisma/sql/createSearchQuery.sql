-- @param {String} $1:id
-- @param {String} $2:tenantId
-- @param {String} $3:lowerCaseQuery
-- @param {String} $4:originalQuery
-- @param {String} $5:fileName
-- @param {String} $6:vector
INSERT INTO "SearchQuery" ("id", "tenantId", "lowerCaseQuery", "originalQuery", "fileName", "vector")
VALUES ($1, $2, NULLIF($3, ''), NULLIF($4, ''), NULLIF($5, ''), $6::vector);
