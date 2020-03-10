const authService = require('./auth.service')

/**
 *
 * @api {get} /login-url get login URL
 * @apiVersion 0.1.0
 * @apiName GetLoginURL
 * @apiDescription Returns the login URL
 * @apiGroup Auth
 *
 */
exports.getLoginURL = (req, res, next) => {
  console.log('auth.ctrl.js=>getLoginURL(): ENV=',process.env.NODE_ENV)
  const loginUrl = authService.getLoginURL()
  console.log('loginURL:',loginUrl)
  return res.json({ loginUrl })
}

/**
 *
 * @api {post} /login login with outlook
 * @apiVersion 0.1.0
 * @apiName Login
 * @apiDescription Returns the loggedIn user's token & subscriptionId
 * @apiGroup Auth
 *
 */
exports.login = async (req, res, next) => {
  // authorize code
  console.log(`auth.ctrl.js=>login(): ENV=${process.env.NODE_ENV}`)
  const authResult = await authService.authorize(req.body.code)
  if (authResult.error) {
    console.log(`Ошибка: ${authResult.error.message}`)
    console.log(`Сообщение: ${JSON.stringify(authResult.error.code.payload)}`)
    return res.sendStatus(500).json(authResult.error)
  }

  // subscribe notifications
  // const subResult = await authService.subscribeNotifications(authResult.data)
  // if (subResult.error) {
  //   return res.sendStatus(500).json(subResult.error)
  // }

  return res.json({
    ...authResult.data
  })
}
