# XMLifyy

PDF to XML Convertor

🧾 XMLifyy – PDF to XML Converter (MERN Stack)
🚀 Technology Stack

> Frontend: React.js (Vite)  
> Backend: Node.js + Express  
> Database: MongoDB  
> Other Tools: Multer, pdf-parse, xmlbuilder, JWT, Mongoose, CORS

Reason for choosing them ++++
React.js --> Fast, modern frontend framework with component-based architecture and reactive UI. Vite offers lightning-fast dev server and optimized builds.

Node.js + Express Lightweight and scalable backend platform. Express simplifies route handling and integrates easily with middleware like Multer and JWT.

MongoDB NoSQL database ideal for storing dynamic data like user info, file metadata, and conversion history. Its document-based model fits JSON/XML well.

JWT (jsonwebtoken) Secure token-based authentication for user sessions and API access.
Mongoose ODM for MongoDB, making it easy to define schemas and interact with the database.

✅ Challenge Levels Implemented
@ Level 1:

User registration & login
PDF upload and basic XML conversion (text-based)
XML display, copy & download options
Conversion history saved to MongoDB

@ Level 2:

JWT-based authentication
Improved multi-page XML display
Sidebar for navigating previous conversions
Enhanced error handling
Responsive UI design

⚙️ Setup Instructions

- Clone the repo
- Run npm install in both client and server folders
- Set environment variables in .env (e.g., MONGO_URI, JWT_SECRET)
- Start backend: npm start
- Start frontend: npm run dev (inside client)

🔍 Approach to PDF-to-XML Conversion
-> Used pdf-parse to extract raw text from PDF
-> Wrapped extracted text inside structured XML using xmlbuilder
-> Stored results in MongoDB along with file metadata

⚠️ Assumptions & Limitations
-> Current XML output is linear and may lose PDF layout
-> No OCR support for scanned/image-based PDFs
-> Only supports text-based PDFs as of now

🌟 Future Improvements (Planned)
🔍 Advanced PDF Parsing Preserve formatting like tables, lists, font styles
🧱 Structured XML Output XML closely mirrors original layout
📄 Multi-Page Viewer Side-by-side viewer for PDFs and their XML
🕐 Real-Time Status Show progress as file uploads/converts
📂 Smart History Filtering Search & filter by filename, date, content keywords
🔐 User Roles Admin/user role-based access control
⚡ Performance Boost Optimize parsing for large PDF files
🔌 API Support REST API for external integrations
