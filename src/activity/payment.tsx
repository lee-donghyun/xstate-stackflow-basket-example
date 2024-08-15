/* eslint-disable react/prop-types */
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";

export const Payment: ActivityComponentType<{ paymentId: number }> = ({
  params: { paymentId },
}) => {
  return (
    <AppScreen
      appBar={{
        title: "결제하기",
      }}
    >
      여기에서 장바구니를 결제합니다. 결제 ID: {paymentId}
    </AppScreen>
  );
};
