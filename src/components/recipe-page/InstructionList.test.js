import React from 'react';
import { cleanup, screen, render } from '@testing-library/react';
import {within} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { Recipe } from '../../Model/recipe.js';
import { InstructionList } from './InstructionList';
import { RecipePage} from './RecipePage';

//Integration tests with RecipePage and InstructionList


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