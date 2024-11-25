import { type DialogSetting } from "@/hooks/use-settings";
import { ButtonSettings } from "./button-settings";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

type SettingDialogProps = {
  setting: DialogSetting;
};

export function SettingDialog({ setting }: SettingDialogProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <ButtonSettings setting={setting} />
      </DialogTrigger>
      {setting.content}
    </Dialog>
  );
}
