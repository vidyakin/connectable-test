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
  const loginUrl = authService.getLoginURL()
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
  const authResult = await authService.authorize(req.body.code)
  if (authResult.error) {
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
