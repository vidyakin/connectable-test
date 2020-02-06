exports.OUTLOOK_ENDPOINT = 'https://outlook.office.com/api/v2.0'

exports.OAUTH2_URLS = {
  tokenHost: 'https://login.microsoftonline.com',
  authorizePath: 'common/oauth2/v2.0/authorize',
  tokenPath: 'common/oauth2/v2.0/token'
}

exports.SUBSCRIPTION_CONFIG = {
  '@odata.type': '#Microsoft.OutlookServices.PushSubscription',
  ChangeType: 'Created,Deleted,Updated',
  NotificationURL: process.env.NOTIFICATION_URL,
  Resource: `https://outlook.office.com/api/v2.0/me/events`,
  ClientState: 'NotificationsForEvents'
}
exports.APP_CONSTANTS = {
  APP_ID: process.env.APP_ID,
  APP_PASSWORD: process.env.APP_PASSWORD,
  APP_SCOPES: process.env.APP_SCOPES,
  REDIRECT_URI: process.env.REDIRECT_URI
}
