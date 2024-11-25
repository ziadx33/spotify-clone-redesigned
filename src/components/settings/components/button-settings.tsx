import { Button } from "@/components/ui/button";
import {
  type AlertSetting,
  type ButtonSetting,
  type DialogSetting,
} from "@/hooks/use-settings";
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
