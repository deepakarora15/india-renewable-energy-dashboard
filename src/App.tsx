import { useAppStore } from './store';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const user = useAppStore((s) => s.user);
  return user ? <Dashboard /> : <Login />;
}
