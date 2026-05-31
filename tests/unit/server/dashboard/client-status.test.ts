import { describe, expect, it } from "vitest";
import { getDashboardClientStatus } from "@/server/dashboard/client-status";

function dateValue(value: string) {
    return new Date(`${value}T00:00:00.000Z`);
}

describe("getDashboardClientStatus", () => {
    it("marks clients with a future start date as leads", () => {
        expect(
            getDashboardClientStatus(
                {
                    startDate: dateValue("2026-06-01"),
                    endDate: null,
                },
                "2026-05-31"
            )
        ).toBe("Lead");
    });

    it("marks clients with a passed end date as inactive", () => {
        expect(
            getDashboardClientStatus(
                {
                    startDate: dateValue("2026-05-01"),
                    endDate: dateValue("2026-05-30"),
                },
                "2026-05-31"
            )
        ).toBe("Inactive");
    });

    it("keeps clients active through the end date", () => {
        expect(
            getDashboardClientStatus(
                {
                    startDate: dateValue("2026-05-01"),
                    endDate: dateValue("2026-05-31"),
                },
                "2026-05-31"
            )
        ).toBe("Active");
    });

    it("marks clients inside an open-ended contract as active", () => {
        expect(
            getDashboardClientStatus(
                {
                    startDate: dateValue("2026-05-01"),
                    endDate: null,
                },
                "2026-05-31"
            )
        ).toBe("Active");
    });
});
