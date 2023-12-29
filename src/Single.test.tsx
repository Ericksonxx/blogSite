import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import Single from './components/Single';

const queryClient = new QueryClient();

test('renders post details when data is loaded', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/posts/1']}>
        <Routes>
          <Route path="/posts/:postId" element={<Single />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
  await waitFor(() => {
    expect(screen.getByTestId('post-title')).toBeInTheDocument();
    expect(screen.getByTestId('post-username')).toBeInTheDocument();
    expect(screen.getByTestId('post-body')).toBeInTheDocument();
  });
});
  
  

test('correct post details for different postIds', async () => {
    const postData = {
        title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        userName: 'Leanne Graham',
        body: 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
  };
  
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/posts/1']}>
          <Routes>
            <Route path="/posts/:postId" element={<Single />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('post-username')).toHaveTextContent(`Written by ${postData.userName}`);
      expect(screen.getByTestId('post-title')).toHaveTextContent(`${postData.title}`);
    });
  });
  
  
  
