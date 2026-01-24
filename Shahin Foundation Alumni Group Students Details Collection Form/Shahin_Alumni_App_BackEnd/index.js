import express from "express";
import cors from "cors";
import fs from "fs";
import ExcelJS from "exceljs";

const app = express();

app.use(cors());
app.use(express.json());

const FILE_PATH = "./alumni.xlsx";

/* -----------------------
   Helper: Validate Input
------------------------ */
function validateRequest(body) {
  const { name, occupation, qualification, code, mobile } = body;

  if (!name || !name.trim()) return "Name is required";
  if (!occupation) return "Occupation is required";
  if (!qualification) return "Qualification is required";
  if (!code || !code.startsWith("+")) return "Invalid country code";

  if (!mobile) return "Mobile number is required";
  if (!/^[6-9]\d{9}$/.test(mobile)) return "Invalid Indian mobile number";

  return null;
}

/* -----------------------
   POST: Save Alumni Data
------------------------ */
app.post("/save", async (req, res) => {
  const error = validateRequest(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const { name, occupation, qualification, code, mobile } = req.body;

  try {
    const workbook = new ExcelJS.Workbook();
    let worksheet;

    if (fs.existsSync(FILE_PATH)) {
      await workbook.xlsx.readFile(FILE_PATH);
      worksheet = workbook.getWorksheet("Alumni");
    }

    if (!worksheet) {
      worksheet = workbook.addWorksheet("Alumni");
    }

    // 🔴 CRITICAL FIX — MUST reassign columns EVERY TIME
    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Occupation", key: "occupation", width: 20 },
      { header: "Qualification", key: "qualification", width: 25 },
      { header: "Country Code", key: "code", width: 15 },
      { header: "Mobile Number", key: "mobile", width: 18 },
    ];

    // Append row
    worksheet.addRow({
      name,
      occupation,
      qualification,
      code,
      mobile,
    });

    // Debug proof
    console.log("Rows in memory:", worksheet.rowCount);

    await workbook.xlsx.writeFile(FILE_PATH);

    res.status(201).json({ message: "Alumni data saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while saving data" });
  }
});



/* -----------------------
   Start Server
------------------------ */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000 !");
});
