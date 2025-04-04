import { pdfjs } from "react-pdf";

// Set worker path (served from public folder)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
