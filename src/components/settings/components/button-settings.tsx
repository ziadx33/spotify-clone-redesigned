import { Button } from "@/components/ui/button";
import type {
  AlertSetting,
  ButtonSetting,
  DialogSetting,
} from "@/hooks/use-settings/types";
import { type ComponentPropsWithoutRef } from "react";

type ButtonSettingsProps = {
  click?: ComponentPropsWithoutRef<"button">["onClick"];
  setting: DialogSetting | ButtonSetting | AlertSetting;
};

export function ButtonSettings({ click, setting }: ButtonSettingsProps) {
  return (
    <Button size="sm" variant={setting.variant ?? "outline"} onClick={click}>
      {setting.value}
    </Button>
  );
}
