import { BrowserRouter, Routes, Route } from "react-router-dom";
import MultiStepWizard from "./screens/MultiStepWizard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<MultiStepWizard />} />
      </Routes>
    </BrowserRouter>
  );
}
