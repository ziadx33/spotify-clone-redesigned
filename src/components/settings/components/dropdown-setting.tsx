import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type DropdownSetting } from "@/hooks/use-settings/types";

type SettingDropdownProps = {
  setting: DropdownSetting;
};

export function SettingDropdown({ setting }: SettingDropdownProps) {
  const selectHandler = (value: string) => {
    const settingValue = setting.options.find(
      (option) => option.value === value,
    );

    settingValue?.onSelect();
  };
  return (
    <Select onValueChange={selectHandler} defaultValue={setting.defaultOption}>
      <SelectTrigger
        defaultValue={setting.defaultOption}
        className="w-fit gap-2"
      >
        <SelectValue placeholder={setting.placehoder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {setting.options.map((option) => {
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  {option.title}
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
