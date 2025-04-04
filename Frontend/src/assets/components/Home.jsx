import React, { useState } from "react";
//import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import axios from "axios";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
//import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";
import { useNavigate } from "react-router-dom";
import "../../pdfWorker";

//import { pdfjs } from "react-pdf";

//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Set PDF.js worker to the local file
//pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

// Set PDF.js worker
//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// Set up the worker file
//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedXML, setConvertedXML] = useState("");
  const [convert, setConvert] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [previewType, setPreviewType] = useState("pdf"); // Toggle between PDF and XML preview
  const [numPages, setNumPages] = useState(null); // Track the number of pages in the PDF

  const navigate = useNavigate();
  const handleFileChange = (e) => {
    // console.log(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setConvert("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios.post(
        "http://localhost:3000/convertFile",
        formData
      );

      const { downloadUrl, xmlContent } = response.data;

      if (!downloadUrl || !xmlContent) {
        throw new Error("Download URL not received");
      }

      // Show XML preview
      setConvertedXML(xmlContent);
      setPreviewType("xml");

      // an anchor tag to download the file
      const link = document.createElement("a");
      link.href = `http://localhost:3000${downloadUrl}`;
      link.setAttribute(
        "download",
        selectedFile.name.replace(/\.pdf$/, ".xml")
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSelectedFile(null);
      setConvert("File Converted Successfully and downloaded!");
      setDownloadError("");
    } catch (error) {
      console.log(error);
      setConvert("");
      setDownloadError(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleCopy = async () => {
    if (!convertedXML) {
      alert("No XML content to copy!");
      return;
    }
    try {
      await navigator.clipboard.writeText(convertedXML);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy to clipboard.");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages); // Set the number of pages in the PDF
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-r from-blue-900 via-purple-900 to-black overflow-auto flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-black text-white shadow-2xl">
        <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          XMLifyy PDF 🚀
        </h1>
        <div className="flex space-x-6">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-md hover:shadow-lg focus:outline-none"
          >
            <span className="text-xl font-semibold text-pink-300 cursor-pointer hover:text-white transition-transform duration-300 hover:scale-110">
              Home
              <span className="absolute inset-0 bg-white bg-opacity-20 rounded-full scale-0 group-hover:scale-100"></span>
            </span>
          </button>

          <button
            onClick={() => navigate("/history")}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full shadow-md hover:shadow-lg focus:outline-none"
          >
            <span className="text-xl font-semibold text-pink-300 cursor-pointer hover:text-white transition-transform duration-300 hover:scale-110">
              History
              <span className="absolute inset-0 bg-white bg-opacity-20 rounded-full scale-0 group-hover:scale-100"></span>
            </span>
          </button>
        </div>
      </nav>

      {/* Main Wrapper  */}
      <div className="flex flex-col md:flex-row p-6 pt-10 items-start justify-center w-full min-h-screen px-6 md:px-20 py-6 space-y-6 md:space-y-0 md:space-x-6">
        {/* Main Content Box */}
        <div className="min-h-[60vh] w-full md:w-2/4 p-6 pt-5 flex flex-col items-center md:items-start">
          <div
            className="relative w-full max-w-md px-8 py-6 md:px-12 md:py-10 rounded-lg shadow-2xl bg-pink-300 text-center border border-gray-600"
            style={{
              boxShadow:
                "10px 10px 30px rgba(0,0,0,0.6), -10px -10px 30px rgba(255,255,255,0.3)",
            }}
          >
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Forge XML from PDF
            </h1>
            <p className="text-sm text-gray-700 mb-5">
              Easily convert PDF to XML format online, download and enjoy the
              XMLifyy's Magic
            </p>

            <div className="flex flex-col items-center space-y-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="FileInput"
              />
              <label
                htmlFor="FileInput"
                className="w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-2 border-blue-400 transition duration-300 hover:bg-blue-900 hover:text-white"
              >
                <FaFilePdf className="text-3xl mr-3 text-red-500" />
                <span className="text-sm">
                  {selectedFile ? selectedFile.name : "Choose PDF"}
                </span>
              </label>
              <button
                onClick={handleSubmit}
                disabled={!selectedFile}
                className="text-white bg-purple-700 hover:bg-black disabled:bg-gray-400 disabled:pointer-events-none duration-300 font-bold px-5 py-2 rounded-lg shadow-md"
              >
                Convert PDF
              </button>
              {convert && (
                <div className="text-green-600 font-semibold">{convert}</div>
              )}
              {downloadError && (
                <div className="text-red-500">{downloadError}</div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Section - Moves Below Main on Mobile */}
        {/* Preview Section */}
        <div
          className="w-full md:w-2/4 min-h-[55vh] p-6 pt-10 rounded-lg shadow-2xl border border-gray-600 flex flex-col items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Transparent black background
            boxShadow:
              "10px 10px 30px rgba(0,0,0,0.6), -10px -10px 30px rgba(255,255,255,0.3)",
          }}
        >
          <div className="bg-pink-300 p-4 rounded-lg shadow-lg border border-gray-700 w-full">
            <h2 className="text-gray-900 font-bold text-lg text-center mb-4">
              Preview Section
            </h2>

            {/* Button Group */}
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setPreviewType("pdf")}
                className={`px-3 py-2 text-sm rounded-lg cursor-pointer ${
                  previewType === "pdf"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                PDF Preview
              </button>
              <button
                onClick={() => setPreviewType("xml")}
                className={`px-3 py-2 text-sm rounded-lg cursor-pointer ${
                  previewType === "xml"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                XML Preview
              </button>
            </div>
          </div>

          {/* PDF Preview */}
          {previewType === "pdf" && selectedFile && (
            <div className="border border-gray-300 rounded-lg p-2 bg-white shadow-md">
              <Document
                file={selectedFile ? URL.createObjectURL(selectedFile) : ""}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    className="mb-2"
                  />
                ))}
              </Document>
            </div>
          )}

          {/* XML Preview */}
          {previewType === "xml" && convertedXML && (
            <div className="flex flex-col items-center w-full max-w-2xl mx-auto overflow-y-auto gap-4">
              <textarea
                className="w-full min-h-[250px] max-h-[500px] p-4 border border-gray-300 rounded-lg text-sm bg-white shadow-md text-black resize-none overflow-y-auto"
                readOnly
                value={convertedXML}
              />
              <button
                onClick={handleCopy}
                className="px-5 py-2 bg-purple-700 text-white rounded-lg shadow-md hover:bg-black transition-all duration-300 cursor-pointer relative z-10"
              >
                Copy to Clipboard
              </button>
            </div>
          )}

          {/* Bubble Animation 
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            {[...Array(20)].map((_, i) => {
              const size = Math.random() * 40 + 20; // Random size between 20px and 60px
              const top = Math.random() * 100 + "%";
              const left = Math.random() * 100 + "%";
              const animationDuration = Math.random() * 5 + 3 + "s";

              return (
                <div
                  key={i}
                  className="absolute rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-40 animate-bounce"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    top,
                    left,
                    animationDuration,
                    animationTimingFunction: "ease-in-out",
                  }}
                ></div>
              );
            })}
          </div>*/}
        </div>
      </div>
    </div>
  );
}

export default Home;
