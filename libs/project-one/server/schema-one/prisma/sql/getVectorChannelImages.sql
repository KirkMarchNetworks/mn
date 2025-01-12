-- @param {String} $1:vector
-- @param {String} $2:ids
SELECT "public"."ChannelImage"."id", "public"."ChannelImage"."vector" <=> $1::vector as "distance"
FROM "public"."ChannelImage"
WHERE "public"."ChannelImage"."id" = ANY(string_to_array($2, ','))
ORDER BY "distance" ASC
