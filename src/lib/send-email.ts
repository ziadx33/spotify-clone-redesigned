"use server";

import { type MailDataRequired } from "@sendgrid/mail";
import { transporter } from "./emails";

export const sendEmail = async (
  data: MailDataRequired | MailDataRequired[],
) => {
  await transporter.send(data);
};
