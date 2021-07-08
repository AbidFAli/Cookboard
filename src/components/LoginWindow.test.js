import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ID_INPUT_PASSWORD, ID_INPUT_USERNAME, LoginWindow, MESSAGE_PASSWORD_MISSING, MESSAGE_USERNAME_MISSING } from './LoginWindow';



describe("tests for LoginWindow", () => {
  let testUserInfo = {
    username: "AbidAli",
    email: "test@test.com",
    password : "password"
  }
  beforeEach(() => {
    render(<LoginWindow/>)
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
    expect(screen.getByText(MESSAGE_USERNAME_MISSING)).toBeInTheDocument()
  })

  test('if the password is empty an error message is displayed', () => {
    let textbox = screen.getByTestId(ID_INPUT_PASSWORD)
    userEvent.clear(textbox)
    expect(screen.getByText(MESSAGE_PASSWORD_MISSING)).toBeInTheDocument()
  })



})