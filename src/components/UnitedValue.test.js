import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { UnitedValue } from './UnitedValue';


const TEST_ID_UNIT = 'ID_UNIT'
const TEST_ID_VALUE = 'ID_VALUE'
describe('UnitedValue', ()=> {

  let setValue, setUnit, handleError;
  beforeEach(() => {
    setValue = jest.fn()
    setUnit = jest.fn()
    handleError = jest.fn(() => new Object())
  })

  function renderUnitedValue(value, valueName, unit, setValue, setUnit, handleError){
    render(<UnitedValue
      value = {value}
      valueName = {valueName}
      unit = {unit}
      setValue = {setValue}
      setUnit = {setUnit}
      handleError = {handleError}
      testIdUnit = {TEST_ID_UNIT}
      testIdValue = {TEST_ID_VALUE}
    />)
  }

  test("displays '' when no value and unit are given", ()=> {
    render(<UnitedValue
      valueName = "Amount"
      setValue = {setValue}
      setUnit = {setUnit}
      handleError = {handleError}
      testIdUnit = {TEST_ID_UNIT}
      testIdValue = {TEST_ID_VALUE}
    />)

    expect(screen.getByTestId(TEST_ID_UNIT)).toHaveDisplayValue('')
    expect(screen.getByTestId(TEST_ID_VALUE)).toHaveDisplayValue('')
  })

  test("displays '' when unit and value are null", ()=> {
    let value = null;
    let valueName = "something"
    let unit = null;
    renderUnitedValue(value, valueName, unit, setValue, setUnit, handleError)
    expect(screen.getByTestId(TEST_ID_UNIT)).toHaveDisplayValue('')
    expect(screen.getByTestId(TEST_ID_VALUE)).toHaveDisplayValue('')
  })

  test('displays a pre-specified unit and value', () => {
    let value = 1
    let valueName = "Amount"
    let unit = "mg"

    renderUnitedValue(value, valueName, unit, setValue, setUnit, handleError)

    expect(screen.getByTestId(TEST_ID_UNIT)).toHaveDisplayValue(unit)
    expect(screen.getByTestId(TEST_ID_VALUE)).toHaveDisplayValue(String(value))
  })

  //After you do this, change other errorHandlers to use null for blank instead of undefined
  //then deal with the nulls in mongo/backendS

  test("passes numbers to setValue", () => {
    let value = 1
    let valueName = "Amount"
    let unit = "mg"
    
    renderUnitedValue(value, valueName, unit, setValue, setUnit, handleError)
    let valueInput = screen.getByTestId(TEST_ID_VALUE)
    userEvent.clear(valueInput)
    userEvent.type(valueInput, "4")
    
    expect(setValue.mock.calls[1][0]).toEqual(4)
  })


  test("passes null to setValue when the value is blank", () => {
    let value = 1
    let valueName = "Amount"
    let unit = "mg"
    
    renderUnitedValue(value, valueName, unit, setValue, setUnit, handleError)
    let valueInput = screen.getByTestId(TEST_ID_VALUE)
    userEvent.clear(valueInput)
    
    expect(setValue.mock.calls[0][0]).toBeNull()
  })
  test("passes strings to setUnit", () => {
    let value = 1
    let valueName = "Amount"
    let unit = "mg"

    renderUnitedValue(value, valueName, unit, setValue, setUnit, handleError)
    let unitInput = screen.getByTestId(TEST_ID_UNIT)
    userEvent.clear(unitInput)
    userEvent.type(unitInput, "unit")

    expect(setUnit.mock.calls[setUnit.mock.calls.length - 1][0]).toMatch("unit")

  })
  test("passes blank to setUnit when the unit is blank", () => {
    let value = 1
    let valueName = "Amount"
    let unit = "mg"

    renderUnitedValue(value, valueName, unit, setValue, setUnit, handleError)
    let unitInput = screen.getByTestId(TEST_ID_UNIT)
    userEvent.clear(unitInput)
    expect(setUnit.mock.calls[0][0]).toEqual('')
  })
})