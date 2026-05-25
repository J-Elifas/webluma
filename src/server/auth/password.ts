import { compare, hash } from "bcryptjs";

export async function hashPassword(password: string) {
    return hash(password, 12);
}

export async function verifyPassword(enteredPassword: string, hashedPassword: string) {
    return compare(enteredPassword, hashedPassword);
}
