export default function Page() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
      background: "#f5f7fa"
    }}>
      
      <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>
        PDF Tools
      </h1>

      <p style={{ marginBottom: "40px", color: "#555" }}>
        Merge, split and optimize your PDFs.
      </p>

      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        textAlign: "center",
        width: "300px"
      }}>
        <h2 style={{ marginBottom: "20px" }}>
          Merge PDF
        </h2>

        <a
          href="/merge"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#0070f3",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          Use Tool
        </a>
      </div>

    </main>
  );
}
