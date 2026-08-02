import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Browse from '@/pages/Browse'
import PlayerDetail from '@/pages/PlayerDetail'
import Compare from '@/pages/Compare'
import Insights from '@/pages/Insights'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/player/:id" element={<PlayerDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </Layout>
  )
}
