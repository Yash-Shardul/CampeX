import { render, screen } from '@testing-library/react';
import App from './App';

// Mocking components that might make API calls on mount
jest.mock("./pages/ClubsPage", () => () => <div data-testid="clubs-page">Clubs Page</div>);
jest.mock("./pages/EventsPage", () => () => <div data-testid="events-page">Events Page</div>);

test('renders app without crashing', () => {
  render(<App />);
  const clubsElement = screen.getByTestId("clubs-page");
  expect(clubsElement).toBeInTheDocument();
});
