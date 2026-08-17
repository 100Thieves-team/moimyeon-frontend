import { Dialog } from "@base-ui/react/dialog";
import type { LoginIntent } from "./auth-intent";

export const loginDialog = Dialog.createHandle<LoginIntent>();
