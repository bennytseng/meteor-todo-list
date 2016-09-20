import { Accounts } from 'meteor/accounts-base';
//the User acconts config from meteor add accounts-ui accounts-password, this allows the use of usernames instead of emails to login
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
})
