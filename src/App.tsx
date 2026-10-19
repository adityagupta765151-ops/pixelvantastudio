import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProjectPage from "./pages/ProjectPage";
import NotFound from "./pages/NotFound";

// Admin is code-split so visitors never download it.
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Suspense fallback={null}><AdminPage /></Suspense>} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
