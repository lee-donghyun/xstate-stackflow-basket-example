/* eslint-disable @typescript-eslint/unbound-method */
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";

import { useFlow } from "../stack/app";

export const Basket: ActivityComponentType = () => {
  const { push } = useFlow();
  return (
    <AppScreen
      appBar={{
        title: "장바구니",
      }}
    >
      여기에서 장바구니를 관리합니다.
      <button
        onClick={() => {
          push("Payment", { paymentId: 13 });
        }}
      >
        여기를 눌러보세요
      </button>
    </AppScreen>
  );
};
