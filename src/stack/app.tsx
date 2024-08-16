import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { stackflow } from "@stackflow/react";

import { Basket } from "../activity/basket";
import { Home } from "../activity/home";
import { Payment } from "../activity/payment";

export const { Stack, useFlow, useStepFlow } = stackflow({
  activities: {
    Basket,
    Home,
    Payment,
  },
  initialActivity: () => "Home",
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      appBar: { height: "64px" },
      theme: "cupertino",
    }),
  ],
  transitionDuration: 350,
});
