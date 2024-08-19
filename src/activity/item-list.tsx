/* eslint-disable react/prop-types */
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";

export const ItemList: ActivityComponentType<{ itemId: number }> = ({
  params: { itemId },
}) => {
  return (
    <AppScreen appBar={{}}>
      여기에서 아이템에 관련된 리스트를 보여줍니다. itemId: {itemId}
    </AppScreen>
  );
};
