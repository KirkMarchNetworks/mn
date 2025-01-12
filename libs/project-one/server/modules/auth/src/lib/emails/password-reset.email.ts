import { BaseTemplateEmail } from "@mn/project-one/server/modules/email";

/**
 * This email is sent when a user forgets their password
 * They can reset their password using this email
 * @param {string} userId
 * @param {string} username
 * @param {string} token
 * @returns {string}
 * @constructor
 */
export const PasswordResetEmail = ({ userId, username, token }: { userId: string, username: string, token: string }) => BaseTemplateEmail({
  body: 'Please click the link below in order to reset your password.',
  title: 'Reset your password',
  username,
  heading: "Did you forget your password?",
  paragraph: 'Please click the button below to reset your password:',
  actionUrl: '',
  actionDisplay: 'Reset Password',
})
