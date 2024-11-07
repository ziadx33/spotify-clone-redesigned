import { Switch } from "@/components/ui/switch";
import { type SettingsItems, type Setting } from "..";
import { useCallback, type Dispatch, type SetStateAction } from "react";
import { Button } from "@/components/ui/button";

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
    const currentValue = setting.type === "SWITCH" && changeValue();

    setting.type === "BUTTON"
      ? setting.onEvent()
      : setting.onEvent(currentValue);
  };
  return (
    <div key={setting.title} className="flex items-center justify-between">
      <h4 className="text-muted-foreground">{setting.title}</h4>
      {setting.type === "SWITCH" ? (
        <Switch checked={setting.value} onCheckedChange={switchChange} />
      ) : (
        <Button variant="outline" onClick={switchChange}>
          {setting.value}
        </Button>
      )}
    </div>
  );
}
