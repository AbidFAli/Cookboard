import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from "history";
import React from 'react';
import { Router } from "react-router";
import { PATH_LOGIN, PATH_MYRECIPES } from '../../paths';
import { ERROR_INCORRECT_PASSWORD, userService } from '../../services/userService';
import {
  errorMessages,
  ids,
  KEY_USER_STORAGE,
  LoginWindow,
  MAX_PASSWORD_LENGTH
} from './LoginWindow';


jest.mock('../../services/userService')

const testUserInfo = {
  username: "AbidAli",
  email: "test@test.com",
  password : "password"
}


const clickOnLoginButton = () => {
  userEvent.click(screen.getByTestId(ids.ID_BUTTON_LOG_IN))
}

const clickOnSignupButton = () => {
  userEvent.click(screen.getByTestId(ids.ID_BUTTON_SIGN_UP))
}

const enterUsername = (username) => {
  let textbox = screen.getByTestId(ids.ID_INPUT_USERNAME)
  userEvent.clear(textbox)
  userEvent.type(textbox, username)
}

const enterPassword = (password) => {
  let textbox = screen.getByTestId(ids.ID_INPUT_PASSWORD)
  userEvent.clear(textbox)
  userEvent.type(textbox, password)
}

const enterConfirmPassword = (confirm) => {
  let textbox = screen.getByTestId(ids.ID_INPUT_CONFIRM_PASSWORD)
  userEvent.clear(textbox)
  userEvent.type(textbox, confirm)
}

const enterEmail = (email) => {
  let textbox = screen.getByTestId(ids.ID_INPUT_EMAIL)
  userEvent.clear(textbox)
  userEvent.type(textbox, email)
}

/*
*@param user: the user object to provide to the loginWindow. If a truthy value is provided, 
*then it will be saved to the mocked local storage before the render.
*@returns
  history: the history object used to render the LoginWindow. This can be used for testing.
*/
const renderWithHistory = async (user) => {
  const history =  createMemoryHistory({initialEntries: ['/login']})
  if(user){
    localStorage.__STORE__[KEY_USER_STORAGE] = JSON.stringify(testUserInfo)
  }
  await act(async () => {
    render(
      <Router history = {history}>
        <LoginWindow updateUser = {jest.fn()} />
      </Router>
    )
  })
  return history
}





describe("tests for LoginWindow.", () => {

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  afterAll(() => {
    localStorage.clear()
  })
  


  describe('With no user credentials stored', () => {
    let history;
    beforeEach(async () => {
      history = await renderWithHistory()
    });


    test('user can enter their username', () => {
      let textbox = screen.getByTestId(ids.ID_INPUT_USERNAME)
      userEvent.type(textbox, testUserInfo.username)
      expect(textbox).toHaveDisplayValue(testUserInfo.username)
    })
  
    test('user can enter their password', () => {
      let textbox = screen.getByTestId(ids.ID_INPUT_PASSWORD)
      userEvent.type(textbox, testUserInfo.password)
      expect(textbox).toHaveDisplayValue(testUserInfo.password)
    })
  
    test('if the username is cleared an error message is displayed', () => {
      let textbox = screen.getByTestId(ids.ID_INPUT_USERNAME)
      userEvent.type(textbox, testUserInfo.username)
      userEvent.clear(textbox)
      expect(screen.getByText(errorMessages.MESSAGE_USERNAME_MISSING)).toBeInTheDocument()
    })
  
    test('if the password is cleared an error message is displayed', () => {
      let textbox = screen.getByTestId(ids.ID_INPUT_PASSWORD)
      userEvent.type(textbox, testUserInfo.password)
      userEvent.clear(textbox)
      expect(screen.getByText(errorMessages.MESSAGE_PASSWORD_MISSING)).toBeInTheDocument()
    })

    test('if the username and password are blank and the log in button is clicked, then their error messages appear', () =>{
      clickOnLoginButton()
      expect(screen.getByText(errorMessages.MESSAGE_PASSWORD_MISSING)).toBeInTheDocument()
      expect(screen.getByText(errorMessages.MESSAGE_USERNAME_MISSING)).toBeInTheDocument()
    })

    test('an error message is displayed if the password you enter is incorrect', async () => {
      enterUsername("someguy")
      enterPassword("something")
      userService.login.mockResolvedValueOnce(ERROR_INCORRECT_PASSWORD)
      clickOnLoginButton()
      let message = await screen.findByText(errorMessages.MESSAGE_INCORRECT_PASSWORD)
      expect(message).toBeInTheDocument()
      
    })
  
    test('after the user logs in successfully, their credentials are saved to local storage', async () => {
      enterUsername(testUserInfo.username)
      enterPassword(testUserInfo.password)
      userService.login.mockResolvedValueOnce({
        ...testUserInfo,
        token: "abcdefg"
      })
      clickOnLoginButton()
      await waitFor(() => expect(localStorage.setItem).toHaveBeenCalledTimes(1))
      let storedUser = JSON.parse(localStorage.__STORE__[KEY_USER_STORAGE])
      expect(storedUser).toMatchObject(testUserInfo)
    })

    describe('tests for signup', () => {
      const  validPassword = "aValidPassword"
      beforeEach(() => {
        clickOnSignupButton()
      })

      test('an error message is displayed if the email is cleared', () => {
        enterEmail("test@test.com")
        userEvent.clear(screen.getByTestId(ids.ID_INPUT_EMAIL))
        expect(screen.getByText(errorMessages.MESSAGE_EMAIL_MISSING)).toBeInTheDocument()
      })

      
      
      describe('tests for password rules', () => {

        test.each([
          ["\\abcd", errorMessages.MESSAGE_INVALID_PASSWORD_CHARACTER],
          [">abcdefghij", errorMessages.MESSAGE_INVALID_PASSWORD_CHARACTER],
          ["<abcdefghij", errorMessages.MESSAGE_INVALID_PASSWORD_CHARACTER],
          ["a", errorMessages.MESSAGE_PASSWORD_TOO_SHORT],
          ["1234567", errorMessages.MESSAGE_PASSWORD_TOO_SHORT],
        ])('typing %s displays %s', function (password, errorMessage) {
          enterPassword(password)
          expect(screen.getByText(errorMessage)).toBeInTheDocument()
        })

        test(`you cannot enter a password greater than ${MAX_PASSWORD_LENGTH} chars`, async () => {
          let testPassword = "a".repeat(MAX_PASSWORD_LENGTH + 1)
          enterPassword(testPassword)
          expect(screen.getByTestId(ids.ID_INPUT_PASSWORD).value).toHaveLength(MAX_PASSWORD_LENGTH)
        })

      })
      
      test('an error message is displayed if the password does not match the confirm password', () => {
        enterPassword(validPassword)
        enterConfirmPassword("abcd")
        expect(screen.getByText(errorMessages.MESSAGE_PASSWORD_MATCH)).toBeInTheDocument()
      })
      test("no error message is displayed if the password matches the confirm password", () => {
        enterPassword(validPassword)
        enterConfirmPassword(validPassword)
        expect(screen.queryByText(errorMessages.MESSAGE_PASSWORD_MATCH)).toBeNull()
      })

      test("an error message is displayed if the confirm password is empty and the password is not", () => {
        enterPassword(validPassword)
        expect(screen.getByText(errorMessages.MESSAGE_PASSWORD_MATCH)).toBeInTheDocument()
      })

      test('if the form is left empty and the signup button is clicked, then the user is prompted to enter their username, password, and email', () => {
        clickOnSignupButton()
        expect(screen.getByText(errorMessages.MESSAGE_USERNAME_MISSING)).toBeInTheDocument()
        expect(screen.getByText(errorMessages.MESSAGE_PASSWORD_MISSING)).toBeInTheDocument()
        expect(screen.getByText(errorMessages.MESSAGE_EMAIL_MISSING)).toBeInTheDocument()
      })

      test('an error message is displayed if the given username is taken',  async () => {
        enterUsername("someguy")
        enterPassword("password")
        enterConfirmPassword("password")
        enterEmail("afaliwork@outlook.com")
        userService.create.mockRejectedValueOnce({
          response: {
            data: {
              name: "UserCreationError",
              error: "Username must be unique."
            }
          }
        })
        clickOnSignupButton()

        let message = await screen.findByText(errorMessages.MESSAGE_USERNAME_NOT_UNIQUE)
        expect(message).toBeInTheDocument()


      })



      test('a successful user signup will log them in and take them to MyRecipesPage', async () => {
        enterUsername(testUserInfo.username)
        enterPassword(testUserInfo.password)
        enterConfirmPassword(testUserInfo.password)
        enterEmail(testUserInfo.email)
        userService.create.mockResolvedValueOnce({
              username: testUserInfo.username,
              id: "12345",
              email: testUserInfo.email
        })
        userService.login.mockClear()
        clickOnSignupButton()

        await waitFor(() => expect(userService.login).toBeCalledTimes(1))
        await waitFor(() => expect(history.location.pathname).toEqual(PATH_MYRECIPES))
      })
    })


  })


  describe('manually render', () => {
    describe("when viewing the login window, if there are user credentials in local storage", () => {

      

      test("if credentials have not expired, then redirect to /myrecipes", async () => {
        userService.isTokenValid.mockResolvedValueOnce(true)
        let history = await renderWithHistory(testUserInfo)
        expect(history.location.pathname).toEqual(PATH_MYRECIPES)
      })

      test("if credentials have expired, then display the login window", async () => {
        userService.isTokenValid.mockResolvedValueOnce(false)
        let history = await renderWithHistory(testUserInfo)
        expect(history.location.pathname).toEqual(PATH_LOGIN)
      })
    })
  })



})