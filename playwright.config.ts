import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const HOST = "127.0.0.1";
const baseURL = `http://${HOST}:${PORT}`;

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 1,
    reporter: [["list"], ["html", { open: "never" }]],
    maxFailures: 1,
    timeout: 15_000,
    globalTimeout: 60_000,
    use: {
        baseURL,
        trace: "off",
        screenshot: "only-on-failure",
        video: "off",
    },
    webServer: {
        command: `bun run start -- -H ${HOST} -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 60_000,
        env: {
            NEXT_TELEMETRY_DISABLED: "1",
        },
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
