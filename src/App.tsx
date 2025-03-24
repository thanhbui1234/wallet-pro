import router from "@/routers/index.tsx";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";

function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
