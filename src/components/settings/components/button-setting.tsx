import { type ButtonSetting } from "@/hooks/use-settings";
import { ButtonSettings } from "./button-settings";

type ButtonSettingProps = {
  setting: ButtonSetting;
};

export function ButtonSetting({ setting }: ButtonSettingProps) {
  const clickHandler = () => {
    setting.onEvent();
  };

  return <ButtonSettings setting={setting} click={clickHandler} />;
}
