import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Home from './page'

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignUpButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useUser: () => ({ isSignedIn: false, user: null }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock the action to avoid DB initialization during tests
vi.mock('./actions/project', () => ({
  tryForFreeAction: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

test('Home renders correctly', () => {
  render(<Home />)
  expect(screen.getByText(/Turn YouTube Videos into/i)).toBeInTheDocument()
  expect(screen.getByText(/Try for Free/i)).toBeInTheDocument()
})
