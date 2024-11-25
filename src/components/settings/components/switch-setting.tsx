import {
  type Setting,
  type SettingsItems,
  type SwitchSetting,
} from "@/hooks/use-settings";
import { Switch } from "@/components/ui/switch";
import { type SetStateAction, useCallback, type Dispatch } from "react";

type SettingDialogProps = {
  setting: SwitchSetting;
  setSettingsItems?: Dispatch<SetStateAction<SettingsItems | null>>;
  itemSettingsKey: string;
};

export function SettingSwitch({
  setting,
  setSettingsItems,
  itemSettingsKey,
}: SettingDialogProps) {
  const changeValue = useCallback(() => {
    const currentValue = !setting.value;
    setSettingsItems?.((v) => {
      const settingItems = v?.[itemSettingsKey] as Setting[];
      return {
        ...v,
        [itemSettingsKey]: settingItems.map((item) => {
          if (setting.type === "SWITCH")
            if (item.order === setting.order)
              return {
                ...setting,
                value: currentValue,
              };
          return item;
        }),
      };
    });
    return currentValue;
  }, [itemSettingsKey, setSettingsItems, setting]);
  const switchChange = () => {
    const currentValue = changeValue();

    setting.onEvent(currentValue);
  };
  return <Switch checked={setting.value} onCheckedChange={switchChange} />;
}
