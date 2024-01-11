import Header from "../layout/Header";
import BookList from "./books/BookList";
import Footer from "../layout/Footer";
import { Navigate, useNavigate } from "react-router-dom";

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
