import { type Dispatch, type SetStateAction } from "react";
import { type Setting, type SettingsItems } from "@/hooks/use-settings";
import { SettingAlert } from "./alert-setting";
import { SettingDialog } from "./dialog-setting";
import { SettingSwitch } from "./switch-setting";
import { ButtonSetting } from "./button-setting";

type SettingProps = {
  setting: Setting;
  setSettingsItems?: Dispatch<SetStateAction<SettingsItems | null>>;
  itemSettingsKey: string;
};

export function Setting({
  setting,
  setSettingsItems,
  itemSettingsKey,
}: SettingProps) {
  return (
    <div key={setting.title} className="flex items-center justify-between">
      <h4 className="text-muted-foreground">{setting.title}</h4>
      {setting.type === "SWITCH" ? (
        <SettingSwitch
          itemSettingsKey={itemSettingsKey}
          setting={setting}
          setSettingsItems={setSettingsItems}
        />
      ) : setting.type === "BUTTON" ? (
        <ButtonSetting setting={setting} />
      ) : setting.type === "DIALOG" ? (
        <SettingDialog setting={setting} />
      ) : setting.type === "ALERT" ? (
        <SettingAlert setting={setting} />
      ) : (
        <div></div>
      )}
    </div>
  );
}
