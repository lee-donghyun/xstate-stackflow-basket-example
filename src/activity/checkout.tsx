import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";

export const Checkout: ActivityComponentType<{ checkoutId: number }> = ({
  params: { checkoutId },
}) => {
  return (
    <AppScreen appBar={{}}>
      <div>Checkout {checkoutId}</div>
    </AppScreen>
  );
};
