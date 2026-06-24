import { render, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SessionExpiryController from "@/app/(app)/SessionExpiryController";

const { signOutMock } = vi.hoisted(() => ({
    signOutMock: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
    signOut: signOutMock,
}));

describe("SessionExpiryController", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        signOutMock.mockReset();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("does not log out immediately after the app loads", () => {
        render(<SessionExpiryController sessionMaxAgeSeconds={5} />);

        expect(signOutMock).not.toHaveBeenCalled();
    });

    it("logs out when the session reaches its max age", () => {
        render(<SessionExpiryController sessionMaxAgeSeconds={5} />);

        expect(signOutMock).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(5_000);
        });

        expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: "/login" });
    });

    it("clears the logout timer when the app shell unmounts", () => {
        const { unmount } = render(<SessionExpiryController sessionMaxAgeSeconds={5} />);

        act(() => {
            unmount();
            vi.advanceTimersByTime(5_000);
        });

        expect(signOutMock).not.toHaveBeenCalled();
    });
});
