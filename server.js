import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { router } from "./routes/index.js";

const PORT = process.env.PORT || 5501;
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 30,
});
app.use(limiter);
app.set("trust proxy", 30);

// Set static folder
app.use(express.static("public"));

// Router
app.use("/api", router);

// Enable cors
app.use(cors());

app.listen(PORT, () => {
  console.log(`server is listening port ${PORT}`);
});
