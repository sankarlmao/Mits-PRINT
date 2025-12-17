import { randomInt } from "crypto";

export function generate5DigitCode() {
  return randomInt(0, 100000).toString().padStart(5, "0");
}