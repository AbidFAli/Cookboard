const isTokenExpiredError = (error) => {
  return error.response && error.response.data.name === 'TokenExpiredError'
}

export {
  isTokenExpiredError
}
