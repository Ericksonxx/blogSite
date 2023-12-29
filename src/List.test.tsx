import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import List from './components/List';

const queryClient = new QueryClient();

const mockPosts = [
  {
    id: 1,
    title: 'Title for Post 1',
    body: 'Body for Post 1',
    userId: 1,
  },
];

const mockUsers = [
  {
    id: 1,
    name: 'User for Post 1',
  },
];

const mockPhotos = [
  {
    id: 1,
    url: 'https://via.placeholder.com/600/92c952',
  },
];

beforeAll(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

test('correct post details for different postIds', async () => {
  (global.fetch as jest.Mock).mockImplementation((url) => {
    if (url.includes('/posts')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockPosts),
      });
    } else if (url.includes('/users')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockUsers),
      });
    } else if (url.includes('/photos')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockPhotos),
      });
    }
    return Promise.reject(new Error('Invalid URL'));
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<List />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Latest Posts')).toBeInTheDocument();

    mockPosts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.body)).toBeInTheDocument();
    });
  });

  (global.fetch as jest.Mock).mockRestore();
});


test('navigates to correct post when a post card is clicked', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    json: () => Promise.resolve(mockPosts),
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/posts/:postId" element={<div data-testid="post-details">Post Details</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );

  await waitFor(() => {
    const postCard = screen.getByText('Title for Post 1');
    act(() => {
      userEvent.click(postCard);
    });
  });

  expect(screen.getByTestId('post-details')).toBeInTheDocument();

  (global.fetch as jest.Mock).mockRestore();
});
