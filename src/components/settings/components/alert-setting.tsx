import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { type AlertSetting } from "@/hooks/use-settings";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ButtonSettings } from "./button-settings";

type SettingAlertProps = {
  setting: AlertSetting;
};

export function SettingAlert({ setting }: SettingAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <ButtonSettings setting={setting} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{setting.alertTitle}</AlertDialogTitle>
          <AlertDialogDescription>{setting.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={setting.onEvent}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
