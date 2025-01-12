import { BaseTemplateEmail, AppName } from '@mn/project-one/server/modules/email';


/**
 * This email is sent to newly registered users
 * @param {string} userId
 * @param {string} username
 * @param {string} token
 * @returns {string}
 * @constructor
 */
export const UserCreatedEmail = ({ userId, username, token }: { userId: string, username: string, token: string }) => BaseTemplateEmail({
  body: 'Please confirm your email address in order to activate your account.',
  title: 'Confirm your email address.',
  username,
  heading: "Is it you we're looking for?",
  paragraph: 'Please confirm your email address by clicking the button below',
  actionUrl: `(userId: ${userId}, token: ${token})`,
  actionDisplay: 'Confirm email address',
  footer: `If you didn't sign up to the ${AppName} platform, you can safely ignore this email.`,
})
