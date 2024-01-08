import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./components/error/ErrorPage.tsx";
import Store from "./components/store/Store.tsx";
import SignInForm from "./components/forms/SignInForm.tsx";
import SignUpForm from "./components/forms/SignUpForm.tsx";
import { ChakraProvider } from "@chakra-ui/react";

const router = createBrowserRouter([
  { path: "/", element: <Store />, errorElement: <ErrorPage /> },
  { path: "/signin", element: <SignInForm /> },
  { path: "/signup", element: <SignUpForm /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
