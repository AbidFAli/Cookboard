import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { useErrorMessenger } from '../Model/errorMessenger';
import { ERROR_MESSAGE_NAN, NumericInput } from "./NumericInput";

const TEST_ID = "idValue"
const TEST_BUTTON = "testButton"

function callWatcher(){
  userEvent.click(screen.getByTestId(TEST_BUTTON))
}

function LiveTest({validator, watcher}){
  const {errors, ...funcs} = useErrorMessenger()
  const [value, setValue] = useState(0)

  return (
    <div>
      <NumericInput
        value = {value}
        setValue = {setValue}
        errors = {errors}
        valueName ="Value"
        {...funcs}
        data-testid = {TEST_ID}
        validator = {validator}
      />
      {watcher && <button data-testid = {TEST_BUTTON} onClick = {() => watcher(value)} /> }
    </div>
  )
}

const getNumericInput = () => { return screen.getByTestId(TEST_ID)}

describe('Tests for NumericInput', () => {
  test('entering "." will display an error that the value must be a number', async () => {
    render(
      <LiveTest />
    )
    let numericInput = getNumericInput()
    userEvent.clear(numericInput)
    userEvent.type(numericInput, ".")
    numericInput.blur()
    expect(await screen.findByText(ERROR_MESSAGE_NAN)).toBeInTheDocument()
  })

  test('entering 3 will not display an error', () => {
    render(
      <LiveTest />
    )
    let numericInput = getNumericInput()
    userEvent.type(numericInput, "3")
    numericInput.blur()
    expect(screen.queryByText(ERROR_MESSAGE_NAN)).toBeNull()
  })

  test('causing an error and fixing it will remove the error', async  () => {
    render(
      <LiveTest />
    )
    let numericInput = getNumericInput()
    userEvent.clear(numericInput)
    userEvent.type(numericInput, ".")
    numericInput.blur()
    await screen.findByText(ERROR_MESSAGE_NAN)
    userEvent.type(numericInput, "3")
    numericInput.blur()
    expect(screen.queryByText(ERROR_MESSAGE_NAN)).toBeNull()
  })

  test('calls setValue with the input parsed to a number when NumericInput blurs and there are no errors', async () => {
    const watcher = jest.fn()
    render(
      <LiveTest watcher = {watcher}/>
    )
    let numericInput = getNumericInput()
    userEvent.clear(numericInput)
    userEvent.type(numericInput, "-3")
    watcher.mockClear()
    numericInput.blur()
    expect(screen.queryByText(ERROR_MESSAGE_NAN)).toBeNull()
    callWatcher() //so we can see the value in LiveTest after the blur event
    expect(watcher).toHaveBeenLastCalledWith(-3)
  })

  describe('tests behavior with validator function', () => {
    test('entering a number that violates the provided validator will display the error message returned by the validator', async () => {
      let errorMessage = "Violation"
      let validator = jest.fn().mockImplementation(() => errorMessage)
      render(
        <LiveTest validator = {validator} />
      )
      let numericInput = getNumericInput()
      userEvent.clear(numericInput)
      userEvent.type(numericInput, "-3")
      numericInput.blur()
      expect(await screen.findByText(errorMessage)).toBeInTheDocument()
    })

    test('if the input text is a number and the validator returns "", then no error message will be displayed', () => {
      let validator = jest.fn().mockImplementation(() => "")
      render(
        <LiveTest validator = {validator} />
      )
      let numericInput = getNumericInput()
      userEvent.clear(numericInput)
      userEvent.type(numericInput, "-3")
      numericInput.blur()
      expect(screen.queryByText(ERROR_MESSAGE_NAN)).toBeNull()
    })
  })



});