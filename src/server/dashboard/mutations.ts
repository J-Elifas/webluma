import type { AddClientInput, AddClientMutationResult } from "./types";

export async function createDashboardClient(
    input: AddClientInput
): Promise<AddClientMutationResult> {
    console.log(input);
    return {
        ok: true,
        client: input,
    };
}
