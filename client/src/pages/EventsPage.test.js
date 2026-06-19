import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventsPage from './EventsPage';
import axios from '../utils/axiosConfig';

// Mock axios
jest.mock('../utils/axiosConfig');

const mockEvents = [
  {
    _id: "1",
    title: "Hackathon 2024",
    description: "Build something cool",
    status: "Upcoming",
    category: "Technical",
    startTime: "2024-05-01T10:00:00Z",
    endTime: "2024-05-01T18:00:00Z",
    venue: "Main Hall",
    host: { name: "Tech Club" }
  }
];

test('renders events fetched from API', async () => {
  axios.get.mockResolvedValue({ data: mockEvents });

  render(
    <BrowserRouter>
      <EventsPage />
    </BrowserRouter>
  );

  // Check for title
  const titleElement = await waitFor(() => screen.getByText(/Hackathon 2024/i));
  expect(titleElement).toBeInTheDocument();

  // Check for category
  expect(screen.getByText(/Technical/i)).toBeInTheDocument();
  
  // Check for host
  expect(screen.getByText(/Organised by Tech Club/i)).toBeInTheDocument();
});

test('shows empty state when no events are returned', async () => {
  axios.get.mockResolvedValue({ data: [] });

  render(
    <BrowserRouter>
      <EventsPage />
    </BrowserRouter>
  );

  const emptyMsg = await waitFor(() => screen.getByText(/No events found/i));
  expect(emptyMsg).toBeInTheDocument();
});
