import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Main } from "./screens/Main";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <Main />
    </DndProvider>
  </StrictMode>
);
