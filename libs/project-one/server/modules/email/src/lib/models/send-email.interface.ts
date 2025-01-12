export interface SendEmailInterface {
  // List of receivers
  email: string;
  // Subject line
  subject: string;
  // Plaintext body
  text: string;
  // HTML body content
  html: string;
}
