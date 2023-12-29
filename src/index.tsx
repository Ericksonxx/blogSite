import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const client  = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={client}>
    <Router>
      <App />
    </Router>
  </QueryClientProvider>
)