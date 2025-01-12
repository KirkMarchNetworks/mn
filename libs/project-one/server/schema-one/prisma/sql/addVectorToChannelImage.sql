-- @param {String} $1:id
-- @param {String} $4:vector
UPDATE "ChannelImage"
SET "vector" = $2::vector
WHERE "id" = $1
