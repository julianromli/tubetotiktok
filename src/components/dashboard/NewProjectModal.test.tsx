import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NewProjectModal } from "./NewProjectModal";
import { createProjectAction } from "@/app/actions/project";

// Mock the action
vi.mock("@/app/actions/project", () => ({
  createProjectAction: vi.fn(),
}));

const mockedCreateProjectAction = vi.mocked(createProjectAction);

// Mock useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("NewProjectModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly when open", () => {
    render(<NewProjectModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText("New Project")).toBeInTheDocument();
    expect(screen.getByLabelText("YouTube URL")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const { container } = render(<NewProjectModal isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("submits the form and calls createProjectAction", async () => {
    const onClose = vi.fn();
    const mockId = "test-id";
    mockedCreateProjectAction.mockResolvedValue({ id: mockId });

    render(<NewProjectModal isOpen={true} onClose={onClose} />);

    const input = screen.getByLabelText("YouTube URL");
    const button = screen.getByText("Generate Script");

    fireEvent.change(input, { target: { value: "https://youtube.com/watch?v=123" } });
    fireEvent.click(button);

    expect(screen.getByText("Generating...")).toBeInTheDocument();
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(createProjectAction).toHaveBeenCalledWith("https://youtube.com/watch?v=123");
      expect(mockPush).toHaveBeenCalledWith(`/dashboard/project/${mockId}`);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("shows error message when action fails", async () => {
    mockedCreateProjectAction.mockRejectedValue(new Error("Invalid URL"));

    render(<NewProjectModal isOpen={true} onClose={vi.fn()} />);

    const input = screen.getByLabelText("YouTube URL");
    const button = screen.getByText("Generate Script");

    fireEvent.change(input, { target: { value: "https://youtube.com/watch?v=invalid" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Invalid URL")).toBeInTheDocument();
    });
    
    expect(screen.getByText("Generate Script")).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<NewProjectModal isOpen={true} onClose={onClose} />);
    
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when clicking backdrop", () => {
    const onClose = vi.fn();
    render(<NewProjectModal isOpen={true} onClose={onClose} />);
    
    fireEvent.click(screen.getByTestId("modal-backdrop"));
    expect(onClose).toHaveBeenCalled();
  });
});
