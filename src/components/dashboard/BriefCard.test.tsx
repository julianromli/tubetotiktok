import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BriefCard } from "./BriefCard";

const mockBrief = {
  id: "1",
  title: "Test Brief",
  hook: "This is a hook",
  script_body: "This is the script body",
  cta: "This is a CTA",
  visual_cue: "This is a visual cue",
  viralScore: 9.0,
  thumbnailUrl: "https://example.com/image.jpg",
};

describe("BriefCard", () => {
  it("renders unlocked brief correctly", () => {
    render(<BriefCard {...mockBrief} isLocked={false} />);
    
    expect(screen.getByText("Test Brief")).toBeInTheDocument();
    expect(screen.getByText('"This is a hook"')).toBeInTheDocument();
    expect(screen.getByText("This is the script body")).toBeInTheDocument();
    expect(screen.getByText("9/10 Viral Score")).toBeInTheDocument();
    expect(screen.getByText("Unlocked")).toBeInTheDocument();
    expect(screen.queryByText("Locked")).not.toBeInTheDocument();
  });

  it("renders locked brief with blur and lock message", () => {
    render(<BriefCard {...mockBrief} isLocked={true} />);
    
    expect(screen.getByText("Locked")).toBeInTheDocument();
    expect(screen.getByText("High potential viral clip detected. Unlock to see the hook.")).toBeInTheDocument();
    expect(screen.getByText("Sign Up to Reveal")).toBeInTheDocument();
    
    // Check that title is still visible in the lock overlay
    expect(screen.getAllByText("Test Brief")).toHaveLength(2); // One in blurred content, one in overlay
  });

  it("calls onUnlock when unlock button is clicked", () => {
    const onUnlock = vi.fn();
    render(<BriefCard {...mockBrief} isLocked={true} onUnlock={onUnlock} />);
    
    fireEvent.click(screen.getByText("Sign Up to Reveal"));
    expect(onUnlock).toHaveBeenCalled();
  });

  it("calls onDownload when download button is clicked", () => {
    const onDownload = vi.fn();
    render(<BriefCard {...mockBrief} isLocked={false} onDownload={onDownload} />);
    
    fireEvent.click(screen.getByText("Download"));
    expect(onDownload).toHaveBeenCalled();
  });

  it("copies content to clipboard when copy button is clicked", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    });

    render(<BriefCard {...mockBrief} isLocked={false} />);
    
    const copyButton = screen.getByText("Copy");
    fireEvent.click(copyButton);
    
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Test Brief"));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("This is a hook"));
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });
});
