// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

require("jest-localstorage-mock");

Object.defineProperty(window, "confirm", {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, "URL", {
  writable: true,
  value: {
    createObjectURL: jest.fn().mockImplementation((file) => file.name),
    revokeObjectURL: jest.fn(),
  },
});
