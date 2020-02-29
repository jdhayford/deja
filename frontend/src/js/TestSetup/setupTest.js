/* eslint-disable import/no-extraneous-dependencies */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

require('jest-expect-message');
global.fetch = require('jest-fetch-mock');

configure({ adapter: new Adapter() });

// Make prop-type warnings throw errors:
const originalConsoleError = console.error;
console.error = (message) => {
  if (/(Warning: Failed prop type)/.test(message)) {
    throw new Error(message.replace('Warning:', 'Error:'));
  }

  originalConsoleError(message);
};
