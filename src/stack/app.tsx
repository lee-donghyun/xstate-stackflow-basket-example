import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { devtoolsPlugin } from "@stackflow/plugin-devtools";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { stackflow } from "@stackflow/react";

import { Basket } from "../activity/basket";
import { Checkout } from "../activity/checkout";
import { Home } from "../activity/home";
import { ItemList } from "../activity/item-list";
import { Menu } from "../activity/menu";
import { Search } from "../activity/search";

export const { Stack, useFlow, useStepFlow } = stackflow({
  activities: {
    Basket,
    Checkout,
    Home,
    ItemList,
    Menu,
    Search,
  },
  initialActivity: () => "Home",
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      appBar: { borderColor: "#FFF", height: "56px" },
      theme: "cupertino",
    }),
    devtoolsPlugin(),
  ],
  transitionDuration: 350,
});
