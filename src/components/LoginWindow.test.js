import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { createMemoryHistory } from "history";
import React from 'react';
import { MemoryRouter, Router } from "react-router";
import { PATH_LOGIN, PATH_MYRECIPES } from '../paths';
import {
  ID_BUTTON_LOG_IN,
  ID_INPUT_PASSWORD,
  ID_INPUT_USERNAME, KEY_USER_STORAGE, LoginWindow,
  MESSAGE_PASSWORD_MISSING,
  MESSAGE_USERNAME_MISSING
} from './LoginWindow';

jest.mock('axios')



const clickOnLoginButton = () => {
  userEvent.click(screen.getByTestId(ID_BUTTON_LOG_IN))
}

const enterUsername = (username) => {
  let textbox = screen.getByTestId(ID_INPUT_USERNAME)
  userEvent.clear(textbox)
  userEvent.type(textbox, username)
}

const enterPassword = (password) => {
  let textbox = screen.getByTestId(ID_INPUT_PASSWORD)
  userEvent.clear(textbox)
  userEvent.type(textbox, password)
}


const testUserInfo = {
  username: "AbidAli",
  email: "test@test.com",
  password : "password"
}


describe("tests for LoginWindow.", () => {

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  afterAll(() => {
    localStorage.clear()
  })
  
  describe('render before test case', () => {
    let updateUser;
    beforeEach(() => {
      updateUser = jest.fn()
      render(
      <MemoryRouter initialEntries = {['/login']}>
        <LoginWindow updateUser = {updateUser}/>
      </MemoryRouter>
      )
    });

    test('user can enter their username', () => {
      let textbox = screen.getByTestId(ID_INPUT_USERNAME)
      userEvent.type(textbox, testUserInfo.username)
      expect(textbox).toHaveDisplayValue(testUserInfo.username)
    })
  
    test('user can enter their password', () => {
      let textbox = screen.getByTestId(ID_INPUT_PASSWORD)
      userEvent.type(textbox, testUserInfo.password)
      expect(textbox).toHaveDisplayValue(testUserInfo.password)
    })
  
    test('if the username is empty an error message is displayed', () => {
      let textbox = screen.getByTestId(ID_INPUT_USERNAME)
      userEvent.clear(textbox)
      clickOnLoginButton()
      expect(screen.getByText(MESSAGE_USERNAME_MISSING)).toBeInTheDocument()
    })
  
    test('if the password is empty an error message is displayed', () => {
      let textbox = screen.getByTestId(ID_INPUT_PASSWORD)
      userEvent.clear(textbox)
      clickOnLoginButton()
      expect(screen.getByText(MESSAGE_PASSWORD_MISSING)).toBeInTheDocument()
    })
  
    test('after the user logs in successfully, their credentials are saved to local storage', async () => {
      enterUsername(testUserInfo.username)
      enterPassword(testUserInfo.password)
      axios.post.mockResolvedValueOnce({data: testUserInfo})
      clickOnLoginButton()
      await waitFor(() => expect(localStorage.setItem).toHaveBeenCalledTimes(1))
      expect(localStorage.__STORE__[KEY_USER_STORAGE]).toEqual(JSON.stringify(testUserInfo))
    })


  })


  describe('manually render', () => {
    describe("when viewing the login window, if there are user credentials in local storage", () => {

      const renderWithHistory = async () => {
        const history =  createMemoryHistory({initialEntries: ['/login']})
        localStorage.__STORE__[KEY_USER_STORAGE] = JSON.stringify(testUserInfo)
        await act(async () => {
          render(
            <Router history = {history}>
              <LoginWindow updateUser = {jest.fn()} />
            </Router>
          )
        })
        return history
      }

      test("if they have not expired, then redirect to /myrecipes", async () => {
        
        axios.post.mockResolvedValueOnce({data: {
          tokenValid: true
        }})
        let history = await renderWithHistory()
        expect(history.location.pathname).toEqual(PATH_MYRECIPES)
      })

      test("if they have expired, then display the login window", async () => {
        axios.post.mockResolvedValueOnce({data: {
          tokenValid: false
        }})
        let history = await renderWithHistory()
        expect(history.location.pathname).toEqual(PATH_LOGIN)
      })
    })
  })



})