import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/history`
        );
        console.log("📜 history data from backend:", res.data);

        // Make sure the response is an array before setting state
        if (Array.isArray(res.data)) {
          setHistory(res.data);
        } else {
          console.error("Unexpected response format:", res.data);
          setHistory([]);
        }
      } catch (error) {
        console.error("❌ Failed to fetch history:", error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#ffffff",
        minHeight: "100vh",
        padding: "2rem",
        paddingTop: "7rem",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          marginBottom: "2.5rem",
          textAlign: "center",
          marginTop: "2rem",
        }}
      >
        🕘 Conversion History
      </h2>

      {loading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <p>No conversions yet.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {history.map((item, index) => (
            <li
              key={index}
              style={{
                backgroundColor: "#1e1e1e",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
                boxShadow: "0 0 8px rgba(255, 255, 255, 0.1)",
              }}
            >
              <p>
                <strong>File:</strong> {item.originalFileName}
              </p>
              {item.pdfUrl && (
                <div>
                  <h4>{item.originalFileName}</h4>
                  <iframe
                    src={`${import.meta.env.VITE_API_BASE_URL}${item.pdfUrl}`}
                    width="100%"
                    height="600px"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      marginTop: "1rem",
                    }}
                    title="PDF Preview"
                  />
                </div>
              )}
              <p>
                <strong>Date:</strong>{" "}
                {new Date(item.convertedAt).toLocaleString()}
              </p>
              <details>
                <summary style={{ cursor: "pointer", color: "#4fc3f7" }}>
                  View XML
                </summary>
                <pre style={{ whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>
                  {item.xmlContent}
                </pre>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
