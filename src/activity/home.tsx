import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";

import { Logo } from "../component/logo";

export const Home: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ renderLeft: Logo }}>
      <div className="p-4">
        <h1>StackFlow</h1>
        <p>StackFlow is a simple and flexible navigation library for React.</p>
      </div>
    </AppScreen>
  );
};
