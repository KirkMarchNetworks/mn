export interface JwtParsedTokenInterface {
  // ID of which tenant the user belongs to
  tenantId: string;

  // Email of the user in the DB
  email: string;

  // Username of user in the DB
  username: string;

  // ID of user in the DB (“sub” is short for subject claim identifies the principal that is the subject of the JWT.)
  sub: string;

  // Public ID of the user in the DB
  publicId: string;

  // The roleID associated to the user
  roleId: string;

  // All the permissions assigned to the above role at the moment the token was created
  permissions: string[];

  // The following is added automatically from the framework
  // Stands for "issued at (seconds since Unix epoch)"
  iat?: number;

  exp?: number;
}
