import { AppProvider } from './providers/AppProvider';
import { AuthProvider } from './providers/AuthProvider';
import { AppRouter } from './routes';

const App: React.FC = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </AppProvider>
  );
};

export default App;
