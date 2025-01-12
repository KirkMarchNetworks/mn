-- @param {String} $1:tenantId
-- @param {String} $2:id
SELECT "id", "originalQuery", "lowerCaseQuery", "fileName", "vector"::text
FROM "SearchQuery"
WHERE "tenantId" = $1 AND "id" = $2
LIMIT 1
