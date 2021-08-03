const isTokenExpiredError = (error) => {
  return error.response && error.response.data.name === 'TokenExpiredError'
}

const isUsernameTakenError = (error) => {
  return error.response && error.response.data.name === 'UserCreationError' && error.response.data.error.match(/username must be unique/i)
}

export {
  isTokenExpiredError,
  isUsernameTakenError
}

