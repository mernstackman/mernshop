import app from "./app";

const port = parseInt(process.env.NODE_ENV === "test" ? 8378 : process.env.PORT, 10) || 80;
export const server = app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
