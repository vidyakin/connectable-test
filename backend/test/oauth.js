const path = require('path')
console.log('path = ',path.resolve(process.cwd(), '..','.env'))

const simpleOauth2 = require('simple-oauth2') 
require('dotenv').config({path: path.resolve(process.cwd(), '.env')})

const { OAUTH2_URLS, APP_CONSTANTS } = require('./../auth/outlook/constants')

console.log(` ENV = ${process.env.NODE_ENV}
! APP_CONSTANTS: 
! APP_ID  = ${APP_CONSTANTS.APP_ID} > ${process.env.APP_ID}
! APP_PSW = ${APP_CONSTANTS.APP_PASSWORD}
! APP_SCO = ${APP_CONSTANTS.APP_SCOPES}
! APP_RED = ${APP_CONSTANTS.REDIRECT_URI}`)

const oauth2 = simpleOauth2.create({
    client: {
      id: APP_CONSTANTS.APP_ID,
      secret: APP_CONSTANTS.APP_PASSWORD
    },
    auth: OAUTH2_URLS
  })


//console.log('OAuth2:\n'+oauth2)

const getLoginURL = () => {
    return oauth2.authorizationCode.authorizeURL({
      scope: APP_CONSTANTS.APP_SCOPES,
      redirect_uri: APP_CONSTANTS.REDIRECT_URI
    })
  }

console.log('LOGIN = '+getLoginURL())