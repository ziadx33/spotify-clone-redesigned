import { type ChangeValueParam } from "@/types";

export function getChangeValue<K>(
  val: ChangeValueParam<K>,
  defValue: K | undefined,
): K {
  let value: K;

  if (typeof val === "function") {
    value = (val as (arg: K | undefined) => K)(defValue);
  } else {
    value = val;
  }

  return value;
}
