export const PermissionNames = {
  // Role Permissions
  CreateRole: 'create_role',
  ReadRole: 'read_role',
  UpdateRole: 'update_role',
  DeleteRole: 'delete_role',

  // User Permissions
  CreateUser: 'create_user',
  ReadUser: 'read_user',
  UpdateUser: 'update_user',
  DeleteUser: 'delete_user',

  // Generic upload permission, needed for any other upload
  // Which uses the tus multi-upload endpoint.
  Upload: 'upload',

  // Vector Image Uploads
  UploadImage: 'upload_image',
  SearchImage: 'search_image',
  ViewImage: 'view_image',
}

export const allPermissionNames = Object.values(PermissionNames);

