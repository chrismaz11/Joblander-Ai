import type { Story } from "@ladle/react";
import { Button, ButtonProps } from "./Button";
import "./button.css";

export const Primary: Story<ButtonProps> = (args) => <Button {...args} />;
Primary.args = {
  primary: true,
  label: "Button",
};

export const Secondary: Story<ButtonProps> = (args) => <Button {...args} />;
Secondary.args = {
  label: "Button",
};

export const Large: Story<ButtonProps> = (args) => <Button {...args} />;
Large.args = {
  size: "large",
  label: "Button",
};

export const Small: Story<ButtonProps> = (args) => <Button {...args} />;
Small.args = {
  size: "small",
  label: "Button",
};
