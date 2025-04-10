import router from "@/routers/index.tsx";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        className="max-w-[90vw] sm:max-w-[350px]"
        toastOptions={{
          style: {
            maxWidth: "100%",
            right: 0,
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
