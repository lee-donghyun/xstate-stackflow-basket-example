import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { stackflow } from "@stackflow/react";

import { Basket } from "../activity/basket";
import { Home } from "../activity/home";
import { Menu } from "../activity/menu";
import { Payment } from "../activity/payment";

export const { Stack, useFlow, useStepFlow } = stackflow({
  activities: {
    Basket,
    Home,
    Menu,
    Payment,
  },
  initialActivity: () => "Home",
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      appBar: { height: "56px" },
      theme: "cupertino",
    }),
  ],
  transitionDuration: 350,
});
