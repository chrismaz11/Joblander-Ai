import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW server with our handlers
export const server = setupServer(...handlers);

// Enable API mocking before tests start
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

// Clean up after all tests are done
afterAll(() => server.close());