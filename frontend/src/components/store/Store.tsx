import { Navigate } from "react-router-dom";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import BookList from "./books/BookList";

const Store = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      <BookList />
      <Footer />
    </>
  );
};

export default Store;
