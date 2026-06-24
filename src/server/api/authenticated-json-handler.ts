import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/server/auth/options";

interface RouteResponseResult {
    response: NextResponse;
}

interface AuthenticatedRouteUserResult {
    userId: string;
}

interface JsonRequestBodyResult {
    body: unknown;
}

interface MutationResult {
    ok: boolean;
    message?: string;
}

interface AuthenticatedJsonRequestOptions<TInput, TResult extends MutationResult> {
    mutate: (input: TInput, userId: string) => Promise<TResult>;
    parseInput: (body: unknown) => TInput | null;
    request: Request;
}

async function getAuthenticatedRouteUser(): Promise<
    AuthenticatedRouteUserResult | RouteResponseResult
> {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role === "GUEST") {
        return {
            response: NextResponse.json({ message: "You are not authenticate!" }, { status: 401 }),
        };
    }

    return {
        userId: session.user.id,
    };
}

async function readJsonRequestBody(
    request: Request
): Promise<JsonRequestBodyResult | RouteResponseResult> {
    try {
        return {
            body: await request.json(),
        };
    } catch {
        return {
            response: NextResponse.json({ message: "Unknown data!" }, { status: 400 }),
        };
    }
}

function inputRequiredResponse() {
    return NextResponse.json({ message: "Input required!" }, { status: 400 });
}

function mutationFailureResponse(message?: string) {
    return NextResponse.json({ message: message || "Something went wrong!" }, { status: 400 });
}

export async function handleAuthenticatedJsonRequest<TInput, TResult extends MutationResult>({
    mutate,
    parseInput,
    request,
}: AuthenticatedJsonRequestOptions<TInput, TResult>) {
    const userResult = await getAuthenticatedRouteUser();
    if ("response" in userResult) {
        return userResult.response;
    }

    const bodyResult = await readJsonRequestBody(request);
    if ("response" in bodyResult) {
        return bodyResult.response;
    }

    const input = parseInput(bodyResult.body);
    if (!input) {
        return inputRequiredResponse();
    }

    const result = await mutate(input, userResult.userId);
    if (!result.ok) {
        return mutationFailureResponse(result.message);
    }

    return NextResponse.json(result);
}
