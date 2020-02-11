const rp = require('request-promise')
const simpleOauth2 = require('simple-oauth2') 
const { OUTLOOK_ENDPOINT, OAUTH2_URLS, APP_CONSTANTS, SUBSCRIPTION_CONFIG } = require('./constants')
const jwt = require('jsonwebtoken');

const oauth2 = simpleOauth2.create({
  client: {
    id: APP_CONSTANTS.APP_ID,
    secret: APP_CONSTANTS.APP_PASSWORD
  },
  auth: OAUTH2_URLS
})

// get login url from outlook
exports.getLoginURL = () => {
  return oauth2.authorizationCode.authorizeURL({
    scope: APP_CONSTANTS.APP_SCOPES,
    redirect_uri: APP_CONSTANTS.REDIRECT_URI
  })
}

// get user and access token from authorization code
exports.authorize = async authCode => {
  try {
    const result = await oauth2.authorizationCode.getToken({
      code: authCode,
      redirect_uri: process.env.REDIRECT_URI,
      scope: process.env.APP_SCOPES
    })
    const token = oauth2.accessToken.create(result)
    let user = jwt.decode(token.token.id_token);
    return {
      data: {
        uid: user.aud,
        aud: user.aud,
        name: user.name,
        email: user.preferred_username,
        access_token: token.token.access_token,
        expires_at: token.token.expires_at.getTime()
      }
    }
  } 
  catch (e) {
    console.log(e.data)
    return {
      error: {
        code: e.data,
        message: e.message
      }
    }
  }
}

exports.subscribeNotifications = async token => {
  try {
    const response = await rp({
      method: 'POST',
      uri: `${OUTLOOK_ENDPOINT}/me/subscriptions`,
      headers: {
        Authorization: 'Bearer ' + token.access_token
      },
      body: {
        ...SUBSCRIPTION_CONFIG
      },
      json: true
    })
    return { data: response.Id }
  } catch (e) {
    return {
      error: {
        code: e.code,
        message: e.message
      }
    }
  }
}
