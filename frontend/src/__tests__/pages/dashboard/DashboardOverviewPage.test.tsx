import { render, screen } from '@testing-library/react';
import { DashboardOverviewPage } from '../../../pages/dashboard/DashboardOverviewPage';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock hooks
vi.mock('../../../modules/profile/hooks/useProfile', () => ({
  useDashboard: vi.fn(),
  useProfileCompletion: vi.fn(),
}));

vi.mock('../../../store/auth.store', () => ({
  useAuthStore: vi.fn(),
}));

// Import mocked modules
import { useDashboard, useProfileCompletion } from '../../../modules/profile/hooks/useProfile';
import { useAuthStore } from '../../../store/auth.store';

const renderDashboard = () => {
  render(
    <BrowserRouter>
      <DashboardOverviewPage />
    </BrowserRouter>
  );
};

describe('DashboardOverviewPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (useDashboard as any).mockReturnValue({ isLoading: true, data: null });
    (useProfileCompletion as any).mockReturnValue({ isLoading: true, data: null });
    (useAuthStore as any).mockReturnValue({ firstName: 'Test' });

    renderDashboard();
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders dashboard content when loaded', () => {
    (useDashboard as any).mockReturnValue({
      isLoading: false,
      data: {
        data: {
          stats: {
            assessmentsTaken: 5,
            savedResources: 12,
            resumesGenerated: 2,
            aiMentorSessions: 8,
          },
        },
      },
    });

    (useProfileCompletion as any).mockReturnValue({
      isLoading: false,
      data: {
        data: {
          isComplete: true,
          percentage: 100,
          missingFields: [],
        },
      },
    });

    (useAuthStore as any).mockReturnValue({ firstName: 'Alex' });

    renderDashboard();
    
    // Check header
    expect(screen.getByText(/Welcome back, Alex!/i)).toBeInTheDocument();

    // Check stats
    expect(screen.getByText('5')).toBeInTheDocument(); // assessments
    expect(screen.getByText('12')).toBeInTheDocument(); // resources
    expect(screen.getByText('2')).toBeInTheDocument(); // resumes
    expect(screen.getByText('8')).toBeInTheDocument(); // sessions

    // Check quick actions
    expect(screen.getByText('Take Assessment')).toBeInTheDocument();
    expect(screen.getByText('AI Career Mentor')).toBeInTheDocument();
    expect(screen.getByText('Build Resume')).toBeInTheDocument();
    expect(screen.getByText('Explore Resources')).toBeInTheDocument();
  });
});
