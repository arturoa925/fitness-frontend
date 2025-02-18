import { useState } from "react";
import { Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Background";

function App() {
  return (
    <>
      <Layout>
        <main>
          <Outlet/>
        </main>
      </Layout>
    </>
  );
}

export default App;
