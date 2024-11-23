import { Switch } from "@/components/ui/switch";
import {
  type ComponentPropsWithoutRef,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Button } from "@/components/ui/button";
import { type Setting, type SettingsItems } from "@/hooks/use-settings";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

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
      : setting.type === "SWITCH" && setting.onEvent(currentValue);
  };

  const ButtonSetting = ({
    click,
  }: {
    click?: ComponentPropsWithoutRef<"button">["onClick"];
  }) =>
    setting.type !== "SWITCH" && (
      <Button size="sm" variant={setting.variant ?? "outline"} onClick={click}>
        {setting.value}
      </Button>
    );

  return (
    <div key={setting.title} className="flex items-center justify-between">
      <h4 className="text-muted-foreground">{setting.title}</h4>
      {setting.type === "SWITCH" ? (
        <Switch checked={setting.value} onCheckedChange={switchChange} />
      ) : setting.type === "BUTTON" ? (
        <ButtonSetting click={switchChange} />
      ) : (
        <Dialog>
          <DialogTrigger>
            <ButtonSetting />
          </DialogTrigger>
          {setting.content}
        </Dialog>
      )}
    </div>
  );
}
