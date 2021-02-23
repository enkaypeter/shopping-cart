module.exports = function makeExpressCallabck (controller, callback) {
  return (req, res) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      files: req.files,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent'),
        'authorization': req.get('Authorization'),
        'access_token': req.get('access_token')
      }
    };
    controller(httpRequest, callback)
    .then(httpResponse => {
      if (httpResponse.headers) {
        res.set(httpResponse.headers)
      }
      res.type('json')
      res.status(httpResponse.statusCode)
      .send({
        message: httpResponse.message,
        status: httpResponse.status,
        data: httpResponse.body
      })
    }).catch(e => res.status(500).send({
      message: 'An unkown error occurred.',
      status: 'error',
      data: {}
    }))
  }
} 