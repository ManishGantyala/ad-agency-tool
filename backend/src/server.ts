import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 5000;

console.log("Starting server...");
console.log("JWT Secret Loaded:", !!process.env.JWT_SECRET);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});