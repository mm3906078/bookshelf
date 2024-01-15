import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import ErrorPage from "./components/error/ErrorPage.tsx";
import LoginForm from "./components/forms/LoginForm.tsx";
import SignUpForm from "./components/forms/SignUpForm.tsx";
import Layout from "./components/layout/Layout.tsx";
import Store from "./components/store";
import OrdersPage from "./components/orders/index.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Navigate to="store" />,
      },
      {
        path: "store",
        element: <Store />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
    ],
  },
  { path: "/login", element: <LoginForm /> },
  { path: "/signup", element: <SignUpForm /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
