import { type ButtonProps } from "@/components/ui/button";
import { type ReactNode } from "react";

type DefSetting = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onEvent: () => unknown | Promise<unknown>;
  order: number;
};

export type ButtonSetting = {
  type: "BUTTON";
  value: string;
  variant?: ButtonProps["variant"];
} & DefSetting;

export type SwitchSetting = {
  type: "SWITCH";
  value: boolean;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onEvent: (value: boolean) => unknown | Promise<unknown>;
} & Omit<DefSetting, "onEvent">;

export type DialogSetting = {
  type: "DIALOG";
  content: ReactNode;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
} & Omit<ButtonSetting, "onEvent" | "type">;

export type AlertSetting = {
  type: "ALERT";
  description: string;
  alertTitle: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
} & Omit<ButtonSetting, "type">;

export type DropdownSettingOption = {
  title: string;
  icon?: ReactNode;
  value: string;
  onSelect: DefSetting["onEvent"];
};

export type DropdownSetting = {
  type: "DROPDOWN";
  placehoder: string;
  defaultOption: string;
  options: DropdownSettingOption[];
} & Omit<DefSetting, "onEvent">;

export type Setting =
  | ButtonSetting
  | SwitchSetting
  | DialogSetting
  | AlertSetting
  | DropdownSetting;

export type SettingsItems = Record<string, Setting[]>;
