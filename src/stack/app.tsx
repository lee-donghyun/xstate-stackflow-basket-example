import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { stackflow } from "@stackflow/react";

import { Basket } from "../activity/basket";
import { Payment } from "../activity/payment";

export const { Stack, useFlow, useStepFlow } = stackflow({
  activities: {
    Basket,
    Payment,
  },
  initialActivity: () => "Basket",
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: "cupertino",
    }),
  ],
  transitionDuration: 350,
});
