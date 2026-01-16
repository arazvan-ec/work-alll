import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/layout'
import {
  Dashboard,
  ClubsPage,
  CreateClubPage,
  ClubDetailPage,
  PlayersPage,
  CreatePlayerPage,
  PlayerDetailPage,
  CoachesPage,
  CreateCoachPage,
  CoachDetailPage,
} from './pages'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/clubs/new" element={<CreateClubPage />} />
            <Route path="/clubs/:id" element={<ClubDetailPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/players/new" element={<CreatePlayerPage />} />
            <Route path="/players/:id" element={<PlayerDetailPage />} />
            <Route path="/coaches" element={<CoachesPage />} />
            <Route path="/coaches/new" element={<CreateCoachPage />} />
            <Route path="/coaches/:id" element={<CoachDetailPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
