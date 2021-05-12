import React from 'react';
import { Recipe } from '../../Model/recipe.js';
import { InstructionList, } from './InstructionList';
import { cleanup, screen, render } from '@testing-library/react';


describe('InstructionList tests', () => {
  afterEach(cleanup);

  test('displays a list of instructions', () => {
      let testInstr = ["heat stove", "cover pan in oil", "add batter"];
      render(<InstructionList instr={testInstr} />);
      testInstr.forEach((value, index) => {
          expect(screen.getByText(Recipe.printInstruction(value,index))).toBeInTheDocument();
      });
  });

});